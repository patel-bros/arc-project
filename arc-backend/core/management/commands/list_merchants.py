from django.core.management.base import BaseCommand
from core.models import User, MerchantWallet

class Command(BaseCommand):
    help = 'List all merchants and their wallet info'

    def handle(self, *args, **options):
        merchants = User.objects(is_merchant=True)
        
        if not merchants:
            self.stdout.write(self.style.WARNING('No merchants found'))
            return

        self.stdout.write(self.style.SUCCESS(f'Found {merchants.count()} merchants:'))
        self.stdout.write('-' * 80)

        for merchant in merchants:
            merchant_wallet = MerchantWallet.objects(user=merchant).first()
            
            self.stdout.write(f'Username: {merchant.username}')
            self.stdout.write(f'Email: {merchant.email}')
            self.stdout.write(f'Merchant Name: {merchant.merchant_name or "Not set"}')
            
            if merchant_wallet:
                self.stdout.write(f'Business Name: {merchant_wallet.business_name}')
                self.stdout.write(f'Total Received: ${merchant_wallet.total_received}')
                self.stdout.write(f'Active: {merchant_wallet.is_active}')
                self.stdout.write(f'Wallets:')
                for wallet in merchant_wallet.wallets:
                    self.stdout.write(f'  {wallet.symbol}: {wallet.public_key} (Balance: {wallet.balance})')
            else:
                self.stdout.write(self.style.WARNING('  No merchant wallet found'))
            
            self.stdout.write('-' * 80)
