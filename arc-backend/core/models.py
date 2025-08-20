from mongoengine import Document, StringField, EmailField, FloatField, DateTimeField, ReferenceField, BinaryField, ListField, CASCADE
import json
from datetime import datetime

class User(Document):
    username = StringField(max_length=100, unique=True, required=True)
    email = EmailField(unique=True, required=True)
    password = StringField(max_length=255, required=True)
    created_at = DateTimeField(default=datetime.utcnow)

class Token(Document):
    user = ReferenceField(User, reverse_delete_rule=CASCADE)
    token = StringField(max_length=255, unique=True, required=True)
    created_at = DateTimeField(default=datetime.utcnow)

class Wallet(Document):
    user = ReferenceField(User, reverse_delete_rule=CASCADE, unique=True)
    public_key = StringField(max_length=200, required=True)
    private_key = StringField(required=True)  # Store as JSON string
    balance = FloatField(default=0.0)
    network = StringField(default="Solana Devnet", max_length=50)

    def get_private_key_list(self):
        if isinstance(self.private_key, str):
            try:
                return json.loads(self.private_key)
            except:
                return []
        return self.private_key

    def set_private_key_list(self, key_list):
        self.private_key = json.dumps(key_list)

class FaceData(Document):
    user = ReferenceField(User, reverse_delete_rule=CASCADE, unique=True)
    encoding = BinaryField(required=True)  # serialized numpy array

class Transaction(Document):
    wallet = ReferenceField(Wallet, reverse_delete_rule=CASCADE)
    to_address = StringField(max_length=200, required=True)
    amount = FloatField(required=True)
    timestamp = DateTimeField(default=datetime.utcnow)
    status = StringField(max_length=50, default="success")

class MerchantWallet(Document):
    merchant_name = StringField(max_length=100, unique=True, required=True)
    public_key = StringField(max_length=200, required=True)
    private_key = StringField(required=True)  # Store as JSON string
    balance = FloatField(default=0.0)
    network = StringField(default="Solana Devnet", max_length=50)

class Order(Document):
    user = ReferenceField(User, reverse_delete_rule=CASCADE)
    type = StringField(choices=["buy", "sell"], required=True)
    symbol = StringField(required=True)
    price = FloatField(required=True)
    amount = FloatField(required=True)
    status = StringField(default="open")
    timestamp = DateTimeField(default=datetime.utcnow)

