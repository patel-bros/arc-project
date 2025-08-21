from django.core.management.base import BaseCommand
from core.models import User, MerchantWallet, CryptoWallet
from core.utils import generate_wallet
import json

class Command(BaseCommand):
    help = 'Setup merchant wallet for a user'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username of the merchant')
        parser.add_argument('--merchant-name', type=str, help='Merchant name (default: username)')
        parser.add_argument('--business-name', type=str, help='Business name (default: username + " Business")')

    def handle(self, *args, **options):
        username = options['username']
        merchant_name = options.get('merchant_name') or username
        business_name = options.get('business_name') or f"{username} Business"

        try:
            # Find the user
            user = User.objects(username=username).first()
            if not user:
                self.stdout.write(self.style.ERROR(f'User "{username}" not found'))
                return

            # Update user to be a merchant
            user.is_merchant = True
            user.merchant_name = merchant_name
            user.save()

            # Check if merchant wallet already exists
            existing_wallet = MerchantWallet.objects(user=user).first()
            if existing_wallet:
                self.stdout.write(self.style.WARNING(f'Merchant wallet already exists for {username}'))
                return

            # Create merchant wallet with crypto wallets
            merchant_wallets = []
            
            # Create wallets for each supported crypto
            supported_cryptos = [
                ('ARC', 'Arc Token'),
                ('BTC', 'Bitcoin'),
                ('ETH', 'Ethereum'),
                ('USDT', 'Tether'),
                ('BNB', 'Binance Coin')
            ]
            
            for symbol, name in supported_cryptos:
                public_key, private_key_list = generate_wallet()
                crypto_wallet = CryptoWallet(
                    symbol=symbol,
                    name=name,
                    public_key=public_key,
                    private_key=json.dumps(private_key_list),
                    balance=1000.0 if symbol == 'ARC' else 0.0,  # Give merchants some initial ARC
                    is_active=True
                )
                merchant_wallets.append(crypto_wallet)
                self.stdout.write(f'Created {symbol} wallet: {public_key}')

            # Create merchant wallet document
            merchant_wallet = MerchantWallet(
                merchant_name=merchant_name,
                user=user,
                wallets=merchant_wallets,
                business_name=business_name,
                is_active=True
            )
            merchant_wallet.save()

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created merchant wallet for {username}\n'
                    f'Merchant name: {merchant_name}\n'
                    f'Business name: {business_name}\n'
                    f'Wallets created: {len(merchant_wallets)}'
                )
            )

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating merchant wallet: {str(e)}'))
