from mongoengine import Document, StringField, EmailField, FloatField, DateTimeField, ReferenceField, BinaryField, ListField, CASCADE, EmbeddedDocument, EmbeddedDocumentField, DictField, BooleanField, IntField
import json
from datetime import datetime, timedelta
import random

class User(Document):
    username = StringField(max_length=100, unique=True, required=True)
    email = EmailField(unique=True, required=True)
    password = StringField(max_length=255, required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    is_merchant = BooleanField(default=False)
    merchant_name = StringField(max_length=100)
    kyc_verified = BooleanField(default=False)
    
    @property
    def is_authenticated(self):
        """
        Always return True. This is a way to tell if the user has been
        authenticated in templates. This is required for Django REST Framework.
        """
        return True
    
    @property
    def is_anonymous(self):
        """
        Always return False. This is a way to tell if the user has been
        authenticated in templates.
        """
        return False

class Token(Document):
    user = ReferenceField(User, reverse_delete_rule=CASCADE)
    token = StringField(max_length=255, unique=True, required=True)
    created_at = DateTimeField(default=datetime.utcnow)

class CryptoWallet(EmbeddedDocument):
    symbol = StringField(required=True)  # BTC, ETH, ARC, USDT, BNB
    name = StringField(required=True)    # Bitcoin, Ethereum, etc.
    public_key = StringField(required=True)
    private_key = StringField(required=True)  # JSON string
    balance = FloatField(default=0.0)
    network = StringField(default="mainnet")
    is_active = BooleanField(default=True)

class Portfolio(Document):
    user = ReferenceField(User, reverse_delete_rule=CASCADE, unique=True)
    wallets = ListField(EmbeddedDocumentField(CryptoWallet))
    total_value_usd = FloatField(default=0.0)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

# Enhanced Trading Pair with price simulation
class TradingPair(Document):
    base_symbol = StringField(required=True)    # BTC
    quote_symbol = StringField(required=True)   # USDT
    pair = StringField(required=True, unique=True)  # BTCUSDT
    current_price = FloatField(default=0.0)
    price_change_24h = FloatField(default=0.0)
    volume_24h = FloatField(default=0.0)
    high_24h = FloatField(default=0.0)
    low_24h = FloatField(default=0.0)
    base_price = FloatField(default=0.0)  # Base price for simulation
    volatility = FloatField(default=0.02)  # Volatility factor (2% default)
    last_updated = DateTimeField(default=datetime.utcnow)
    is_active = BooleanField(default=True)
    
    def simulate_price(self):
        """Simulate realistic price movement with controlled volatility"""
        if not self.base_price:
            # Set base prices for different cryptos
            base_prices = {
                'BTCUSDT': 67234.50,
                'ETHUSDT': 3456.78,
                'ARCUSDT': 0.45,  # Our native token
                'SOLUSDT': 156.23,
                'BNBUSDT': 542.67,
                'ADAUSDT': 0.78,
                'DOTUSDT': 12.34,
                'LINKUSDT': 23.45
            }
            self.base_price = base_prices.get(self.pair, 1.0)
        
        # Calculate time-based variation (market hours simulation)
        now = datetime.utcnow()
        hour = now.hour
        
        # Lower volatility during certain hours (night hours)
        time_factor = 0.5 if 22 <= hour or hour <= 6 else 1.0
        
        # Generate price change within volatility limits
        max_change = self.volatility * time_factor
        price_change_percent = random.uniform(-max_change, max_change)
        
        # Apply change to current price or base price
        base = self.current_price if self.current_price > 0 else self.base_price
        new_price = base * (1 + price_change_percent)
        
        # Ensure price doesn't deviate too much from base price (±20%)
        min_price = self.base_price * 0.8
        max_price = self.base_price * 1.2
        new_price = max(min_price, min(max_price, new_price))
        
        # Calculate 24h changes
        old_price = self.current_price if self.current_price > 0 else self.base_price
        self.price_change_24h = ((new_price - old_price) / old_price) * 100
        
        # Update other fields
        self.current_price = round(new_price, 8)
        self.volume_24h = random.uniform(1000000, 50000000)  # Random volume
        
        # Set high/low based on current price with some variation
        variation = new_price * 0.05  # 5% variation
        self.high_24h = round(new_price + random.uniform(0, variation), 8)
        self.low_24h = round(new_price - random.uniform(0, variation), 8)
        
        self.last_updated = datetime.utcnow()
        self.save()
        
        return self.current_price

class PriceHistory(Document):
    """Store historical price data for charts"""
    pair = ReferenceField(TradingPair, required=True)
    price = FloatField(required=True)
    volume = FloatField(default=0.0)
    timestamp = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'indexes': [
            ('pair', 'timestamp'),
            {'fields': ['timestamp'], 'expireAfterSeconds': 86400 * 30}  # 30 days retention
        ]
    }

class Order(Document):
    user = ReferenceField(User, reverse_delete_rule=CASCADE)
    pair = ReferenceField(TradingPair, required=True)
    order_type = StringField(choices=["market", "limit"], required=True)
    side = StringField(choices=["buy", "sell"], required=True)
    quantity = FloatField(required=True)
    price = FloatField()  # For limit orders
    filled_quantity = FloatField(default=0.0)
    status = StringField(choices=["pending", "filled", "cancelled", "partial"], default="pending")
    order_id = StringField(unique=True, required=True)
    fee = FloatField(default=0.0)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

class Trade(Document):
    buyer = ReferenceField(User, required=True)
    seller = ReferenceField(User, required=True)
    pair = ReferenceField(TradingPair, required=True)
    quantity = FloatField(required=True)
    price = FloatField(required=True)
    total = FloatField(required=True)
    fee = FloatField(default=0.0)
    trade_id = StringField(unique=True, required=True)
    created_at = DateTimeField(default=datetime.utcnow)

class Transaction(Document):
    user = ReferenceField(User, reverse_delete_rule=CASCADE)
    transaction_type = StringField(choices=["deposit", "withdraw", "trade", "transfer", "purchase"], required=True)
    crypto_symbol = StringField(required=True)
    amount = FloatField(required=True)
    to_address = StringField()
    from_address = StringField()
    to_user = ReferenceField(User)  # For internal transfers
    tx_hash = StringField(unique=True)
    status = StringField(choices=["pending", "confirmed", "failed"], default="pending")
    fee = FloatField(default=0.0)
    memo = StringField(max_length=500)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

class MerchantWallet(Document):
    merchant_name = StringField(max_length=100, unique=True, required=True)
    user = ReferenceField(User, reverse_delete_rule=CASCADE)
    wallets = ListField(EmbeddedDocumentField(CryptoWallet))
    business_name = StringField(max_length=200)
    website_url = StringField(max_length=500)
    api_key = StringField(max_length=100)
    is_active = BooleanField(default=True)
    total_received = FloatField(default=0.0)
    created_at = DateTimeField(default=datetime.utcnow)

# Curve Cart Integration
class CurveCart(Document):
    user = ReferenceField(User, reverse_delete_rule=CASCADE)
    items = ListField(DictField())  # [{product_id, name, price, quantity}]
    total_amount = FloatField(required=True)
    currency = StringField(default="USD")
    crypto_payment = DictField()  # {symbol, amount, address, tx_hash}
    merchant = ReferenceField(MerchantWallet)
    status = StringField(choices=["pending", "paid", "shipped", "delivered", "cancelled"], default="pending")
    cart_id = StringField(unique=True, required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

class FaceData(Document):
    user = ReferenceField(User, reverse_delete_rule=CASCADE, unique=True)
    encoding = BinaryField(required=True)  # serialized numpy array
    created_at = DateTimeField(default=datetime.utcnow)

