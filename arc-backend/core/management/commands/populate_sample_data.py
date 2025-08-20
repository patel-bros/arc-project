import json
import random
import hashlib
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from core.models import User, Portfolio, CryptoWallet, Order, Trade, Transaction, TradingPair, PriceHistory
from core.utils import generate_wallet, execute_market_order, generate_order_id, generate_trade_id, generate_transaction_hash

class Command(BaseCommand):
    help = 'Populate MongoDB with sample users and trading data'

    def handle(self, *args, **options):
        self.stdout.write('Starting sample data population...')
        
        # Create sample users
        self.create_sample_users()
        
        # Create sample orders and trades
        self.create_sample_orders()
        
        # Create sample transactions
        self.create_sample_transactions()
        
        # Add some price history
        self.create_price_history()
        
        self.stdout.write(self.style.SUCCESS('Sample data populated successfully!'))

    def create_sample_users(self):
        """Create sample users with portfolios and wallets"""
        sample_users = [
            {'username': 'trader1', 'email': 'trader1@example.com', 'password': 'password123'},
            {'username': 'trader2', 'email': 'trader2@example.com', 'password': 'password123'},
            {'username': 'investor1', 'email': 'investor1@example.com', 'password': 'password123'},
            {'username': 'whale1', 'email': 'whale1@example.com', 'password': 'password123'},
            {'username': 'newbie1', 'email': 'newbie1@example.com', 'password': 'password123'},
        ]
        
        cryptos = ['BTC', 'ETH', 'ARC', 'USDT', 'SOL']
        
        for user_data in sample_users:
            # Check if user already exists
            if User.objects(username=user_data['username']).first():
                self.stdout.write(f"User {user_data['username']} already exists, skipping...")
                continue
                
            # Create user
            password_hash = hashlib.sha256(user_data['password'].encode()).hexdigest()
            user = User(
                username=user_data['username'],
                email=user_data['email'],
                password=password_hash,
                kyc_verified=True
            )
            user.save()
            
            # Create portfolio with wallets
            portfolio = Portfolio(user=user, wallets=[])
            
            for crypto in cryptos:
                public_key, private_key_list = generate_wallet()
                
                # Assign random balances to make it more realistic
                if crypto == 'USDT':
                    balance = random.uniform(1000, 50000)  # USDT for trading
                elif crypto == 'BTC':
                    balance = random.uniform(0.1, 5.0)
                elif crypto == 'ETH':
                    balance = random.uniform(1.0, 20.0)
                elif crypto == 'ARC':
                    balance = random.uniform(100, 10000)
                else:  # SOL
                    balance = random.uniform(10, 500)
                
                wallet = CryptoWallet(
                    symbol=crypto,
                    name=f"{crypto} Wallet",
                    public_key=public_key,
                    private_key=json.dumps(private_key_list),
                    balance=balance,
                    network='mainnet'
                )
                portfolio.wallets.append(wallet)
            
            portfolio.save()
            self.stdout.write(f"Created user: {user_data['username']} with {len(cryptos)} wallets")

    def create_sample_orders(self):
        """Create sample orders and trades"""
        users = User.objects.all()
        trading_pairs = TradingPair.objects.all()
        
        if not users or not trading_pairs:
            self.stdout.write("No users or trading pairs found, skipping orders...")
            return
        
        order_types = ['market', 'limit']
        sides = ['buy', 'sell']
        
        for _ in range(20):  # Create 20 random orders
            user = random.choice(users)
            pair = random.choice(trading_pairs)
            
            order = Order(
                user=user,
                pair=pair,
                order_type=random.choice(order_types),
                side=random.choice(sides),
                quantity=random.uniform(0.1, 10.0),
                price=pair.current_price * random.uniform(0.95, 1.05),
                order_id=generate_order_id(),
                status=random.choice(['pending', 'filled', 'cancelled']),
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30))
            )
            order.save()
            
            # Create corresponding trade if order is filled
            if order.status == 'filled':
                # For simplicity, use the same user as both buyer and seller (market maker simulation)
                trade = Trade(
                    buyer=user if order.side == 'buy' else random.choice(users),
                    seller=user if order.side == 'sell' else random.choice(users),
                    pair=pair,
                    quantity=order.quantity,
                    price=order.price,
                    total=order.quantity * order.price,
                    fee=order.quantity * order.price * 0.001,  # 0.1% fee
                    trade_id=generate_trade_id(),
                    created_at=order.created_at + timedelta(seconds=random.randint(1, 300))
                )
                trade.save()
        
        self.stdout.write(f"Created sample orders and trades")

    def create_sample_transactions(self):
        """Create sample transactions"""
        users = User.objects.all()
        
        if not users:
            return
        
        transaction_types = ['deposit', 'withdraw', 'trade', 'transfer']
        cryptos = ['BTC', 'ETH', 'ARC', 'USDT', 'SOL']
        
        for _ in range(30):  # Create 30 random transactions
            user = random.choice(users)
            crypto = random.choice(cryptos)
            tx_type = random.choice(transaction_types)
            
            if tx_type == 'deposit':
                amount = random.uniform(100, 5000) if crypto == 'USDT' else random.uniform(0.01, 1.0)
            elif tx_type == 'withdraw':
                amount = random.uniform(10, 1000) if crypto == 'USDT' else random.uniform(0.001, 0.5)
            else:  # trade or transfer
                amount = random.uniform(50, 2000) if crypto == 'USDT' else random.uniform(0.01, 2.0)
            
            transaction = Transaction(
                user=user,
                transaction_type=tx_type,
                crypto_symbol=crypto,
                amount=amount,
                from_address=f"external_{crypto.lower()}_address" if tx_type == 'deposit' else f"user_{crypto.lower()}_address",
                to_address=f"user_{crypto.lower()}_address" if tx_type == 'deposit' else f"external_{crypto.lower()}_address",
                tx_hash=generate_transaction_hash(),
                fee=amount * 0.001,  # 0.1% fee
                status=random.choice(['pending', 'confirmed', 'failed']),
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30))
            )
            transaction.save()
        
        self.stdout.write("Created sample transactions")

    def create_price_history(self):
        """Create price history for better charts"""
        trading_pairs = TradingPair.objects.all()
        
        for pair in trading_pairs:
            # Create hourly price data for the last 7 days
            for hours_ago in range(168, 0, -1):  # 168 hours = 7 days
                timestamp = datetime.utcnow() - timedelta(hours=hours_ago)
                
                # Create realistic price movement
                base_price = pair.current_price
                volatility = random.uniform(-0.05, 0.05)  # 5% max change per hour
                price = base_price * (1 + volatility)
                
                # Ensure price doesn't go below $1
                price = max(price, 1.0)
                
                price_history = PriceHistory(
                    pair=pair,
                    price=round(price, 8),
                    volume=random.uniform(1000, 100000),
                    timestamp=timestamp
                )
                price_history.save()
        
        self.stdout.write("Created price history data")
