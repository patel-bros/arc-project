import random
import string
import base64
import hashlib
import uuid
from datetime import datetime, timedelta
from .models import TradingPair, PriceHistory, Transaction, Portfolio
import json

def generate_wallet():
    """Generate a dummy wallet for development purposes"""
    # Generate a dummy public key
    public_key = 'dummy_' + ''.join(random.choices(string.ascii_letters + string.digits, k=44))
    
    # Generate a dummy secret key as a list of integers (simulating Solana keypair)
    secret_key_list = [random.randint(0, 255) for _ in range(32)]
    
    return public_key, secret_key_list

def generate_transaction_hash():
    """Generate a realistic transaction hash"""
    return hashlib.sha256(str(uuid.uuid4()).encode()).hexdigest()

def generate_order_id():
    """Generate unique order ID"""
    return f"ORD_{int(datetime.utcnow().timestamp())}_{random.randint(1000, 9999)}"

def generate_trade_id():
    """Generate unique trade ID"""
    return f"TRD_{int(datetime.utcnow().timestamp())}_{random.randint(1000, 9999)}"

def initialize_trading_pairs():
    """Initialize default trading pairs with base prices"""
    pairs_data = [
        {
            'base_symbol': 'BTC',
            'quote_symbol': 'USDT',
            'pair': 'BTCUSDT',
            'base_price': 67234.50,
            'volatility': 0.025,  # 2.5% volatility
        },
        {
            'base_symbol': 'ETH',
            'quote_symbol': 'USDT',
            'pair': 'ETHUSDT',
            'base_price': 3456.78,
            'volatility': 0.03,  # 3% volatility
        },
        {
            'base_symbol': 'ARC',
            'quote_symbol': 'USDT',
            'pair': 'ARCUSDT',
            'base_price': 0.45,
            'volatility': 0.05,  # 5% volatility (newer token)
        },
        {
            'base_symbol': 'SOL',
            'quote_symbol': 'USDT',
            'pair': 'SOLUSDT',
            'base_price': 156.23,
            'volatility': 0.04,  # 4% volatility
        },
        {
            'base_symbol': 'BNB',
            'quote_symbol': 'USDT',
            'pair': 'BNBUSDT',
            'base_price': 542.67,
            'volatility': 0.025,  # 2.5% volatility
        },
        {
            'base_symbol': 'ADA',
            'quote_symbol': 'USDT',
            'pair': 'ADAUSDT',
            'base_price': 0.78,
            'volatility': 0.035,  # 3.5% volatility
        },
        {
            'base_symbol': 'DOT',
            'quote_symbol': 'USDT',
            'pair': 'DOTUSDT',
            'base_price': 12.34,
            'volatility': 0.04,  # 4% volatility
        },
        {
            'base_symbol': 'LINK',
            'quote_symbol': 'USDT',
            'pair': 'LINKUSDT',
            'base_price': 23.45,
            'volatility': 0.035,  # 3.5% volatility
        }
    ]
    
    for pair_data in pairs_data:
        try:
            pair = TradingPair.objects(pair=pair_data['pair']).first()
            if not pair:
                pair = TradingPair(**pair_data)
                pair.current_price = pair_data['base_price']
                pair.save()
                print(f"Created trading pair: {pair_data['pair']}")
            else:
                # Update base price if not set
                if not pair.base_price:
                    pair.base_price = pair_data['base_price']
                    pair.save()
        except Exception as e:
            print(f"Error creating pair {pair_data['pair']}: {e}")

def simulate_all_prices():
    """Simulate prices for all active trading pairs"""
    pairs = TradingPair.objects(is_active=True)
    updated_prices = {}
    
    for pair in pairs:
        try:
            new_price = pair.simulate_price()
            updated_prices[pair.pair] = {
                'price': new_price,
                'change_24h': pair.price_change_24h,
                'volume_24h': pair.volume_24h,
                'high_24h': pair.high_24h,
                'low_24h': pair.low_24h
            }
            
            # Store price history
            PriceHistory(
                pair=pair,
                price=new_price,
                volume=pair.volume_24h
            ).save()
            
        except Exception as e:
            print(f"Error simulating price for {pair.pair}: {e}")
    
    return updated_prices

def calculate_portfolio_value(user):
    """Calculate total portfolio value in USD"""
    try:
        portfolio = Portfolio.objects(user=user).first()
        if not portfolio:
            return 0.0
        
        total_value = 0.0
        
        for wallet in portfolio.wallets:
            if wallet.balance > 0:
                if wallet.symbol == 'USDT':
                    # USDT is pegged to USD
                    total_value += wallet.balance
                else:
                    # Get current price for this crypto
                    pair_name = f"{wallet.symbol}USDT"
                    trading_pair = TradingPair.objects(pair=pair_name).first()
                    if trading_pair and trading_pair.current_price > 0:
                        total_value += wallet.balance * trading_pair.current_price
        
        # Update portfolio total value
        portfolio.total_value_usd = total_value
        portfolio.updated_at = datetime.utcnow()
        portfolio.save()
        
        return total_value
        
    except Exception as e:
        print(f"Error calculating portfolio value: {e}")
        return 0.0

def process_crypto_transfer(from_user, to_user, crypto_symbol, amount, memo=""):
    """Process internal crypto transfer between users"""
    try:
        # Get sender's portfolio
        sender_portfolio = Portfolio.objects(user=from_user).first()
        if not sender_portfolio:
            return False, "Sender portfolio not found"
        
        # Get receiver's portfolio
        receiver_portfolio = Portfolio.objects(user=to_user).first()
        if not receiver_portfolio:
            return False, "Receiver portfolio not found"
        
        # Find sender's wallet
        sender_wallet = None
        for wallet in sender_portfolio.wallets:
            if wallet.symbol == crypto_symbol:
                sender_wallet = wallet
                break
        
        if not sender_wallet or sender_wallet.balance < amount:
            return False, "Insufficient balance"
        
        # Find or create receiver's wallet
        receiver_wallet = None
        for wallet in receiver_portfolio.wallets:
            if wallet.symbol == crypto_symbol:
                receiver_wallet = wallet
                break
        
        if not receiver_wallet:
            # Create new wallet for receiver
            from .models import CryptoWallet
            public_key, private_key = generate_wallet()
            receiver_wallet = CryptoWallet(
                symbol=crypto_symbol,
                name=get_crypto_name(crypto_symbol),
                public_key=public_key,
                private_key=json.dumps(private_key),
                balance=0.0
            )
            receiver_portfolio.wallets.append(receiver_wallet)
        
        # Process transfer
        sender_wallet.balance -= amount
        receiver_wallet.balance += amount
        
        # Save portfolios
        sender_portfolio.save()
        receiver_portfolio.save()
        
        # Create transaction records
        tx_hash = generate_transaction_hash()
        
        # Sender transaction (outgoing)
        Transaction(
            user=from_user,
            transaction_type="transfer",
            crypto_symbol=crypto_symbol,
            amount=-amount,  # Negative for outgoing
            to_address=receiver_wallet.public_key,
            from_address=sender_wallet.public_key,
            to_user=to_user,
            tx_hash=tx_hash,
            status="confirmed",
            memo=memo
        ).save()
        
        # Receiver transaction (incoming)
        Transaction(
            user=to_user,
            transaction_type="transfer",
            crypto_symbol=crypto_symbol,
            amount=amount,  # Positive for incoming
            to_address=receiver_wallet.public_key,
            from_address=sender_wallet.public_key,
            tx_hash=tx_hash,
            status="confirmed",
            memo=memo
        ).save()
        
        return True, "Transfer completed successfully"
        
    except Exception as e:
        return False, f"Transfer failed: {str(e)}"

def get_crypto_name(symbol):
    """Get full name of cryptocurrency"""
    names = {
        'BTC': 'Bitcoin',
        'ETH': 'Ethereum',
        'ARC': 'Arc Token',
        'USDT': 'Tether USD',
        'SOL': 'Solana',
        'BNB': 'Binance Coin',
        'ADA': 'Cardano',
        'DOT': 'Polkadot',
        'LINK': 'Chainlink'
    }
    return names.get(symbol, symbol)

def execute_market_order(user, pair, side, quantity):
    """Execute a market order immediately at current price"""
    try:
        trading_pair = TradingPair.objects(pair=pair).first()
        if not trading_pair:
            return False, "Trading pair not found"
        
        # Simulate price for fresh data
        current_price = trading_pair.simulate_price()
        
        portfolio = Portfolio.objects(user=user).first()
        if not portfolio:
            return False, "Portfolio not found"
        
        base_symbol = trading_pair.base_symbol
        quote_symbol = trading_pair.quote_symbol
        total_cost = quantity * current_price
        
        if side == "buy":
            # Check if user has enough quote currency (e.g., USDT)
            quote_wallet = None
            for wallet in portfolio.wallets:
                if wallet.symbol == quote_symbol:
                    quote_wallet = wallet
                    break
            
            if not quote_wallet or quote_wallet.balance < total_cost:
                return False, "Insufficient balance"
            
            # Deduct quote currency
            quote_wallet.balance -= total_cost
            
            # Add base currency
            base_wallet = None
            for wallet in portfolio.wallets:
                if wallet.symbol == base_symbol:
                    base_wallet = wallet
                    break
            
            if not base_wallet:
                # Create new wallet
                from .models import CryptoWallet
                public_key, private_key = generate_wallet()
                base_wallet = CryptoWallet(
                    symbol=base_symbol,
                    name=get_crypto_name(base_symbol),
                    public_key=public_key,
                    private_key=json.dumps(private_key),
                    balance=0.0
                )
                portfolio.wallets.append(base_wallet)
            
            base_wallet.balance += quantity
            
        else:  # sell
            # Check if user has enough base currency
            base_wallet = None
            for wallet in portfolio.wallets:
                if wallet.symbol == base_symbol:
                    base_wallet = wallet
                    break
            
            if not base_wallet or base_wallet.balance < quantity:
                return False, "Insufficient balance"
            
            # Deduct base currency
            base_wallet.balance -= quantity
            
            # Add quote currency
            quote_wallet = None
            for wallet in portfolio.wallets:
                if wallet.symbol == quote_symbol:
                    quote_wallet = wallet
                    break
            
            if not quote_wallet:
                # Create new wallet
                from .models import CryptoWallet
                public_key, private_key = generate_wallet()
                quote_wallet = CryptoWallet(
                    symbol=quote_symbol,
                    name=get_crypto_name(quote_symbol),
                    public_key=public_key,
                    private_key=json.dumps(private_key),
                    balance=0.0
                )
                portfolio.wallets.append(quote_wallet)
            
            quote_wallet.balance += total_cost
        
        portfolio.save()
        
        # Create trade record
        from .models import Trade
        Trade(
            buyer=user if side == "buy" else user,  # Simplified for market orders
            seller=user if side == "sell" else user,
            pair=trading_pair,
            quantity=quantity,
            price=current_price,
            total=total_cost,
            trade_id=generate_trade_id()
        ).save()
        
        # Create transaction record
        Transaction(
            user=user,
            transaction_type="trade",
            crypto_symbol=base_symbol,
            amount=quantity if side == "buy" else -quantity,
            status="confirmed",
            memo=f"{side.upper()} {quantity} {base_symbol} at {current_price}"
        ).save()
        
        return True, f"Order executed: {side} {quantity} {base_symbol} at {current_price}"
        
    except Exception as e:
        return False, f"Order execution failed: {str(e)}"
