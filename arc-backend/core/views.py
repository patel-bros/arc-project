from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from .models import User, Wallet, FaceData, Transaction, MerchantWallet, Order, Token
from .serializers import UserSerializer, WalletSerializer
from .utils import generate_wallet
import face_recognition
import numpy as np
import base64
import secrets
from datetime import datetime
import json
from rest_framework.decorators import authentication_classes
from rest_framework.authentication import BaseAuthentication
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.permissions import AllowAny
import random

SYMBOLS = ["ARC", "BTC", "ETH"]

# Custom permission class for MongoEngine User
class IsMongoAuthenticated(BasePermission):
    """
    Custom permission class for MongoEngine User models
    """
    def has_permission(self, request, view):
        # Check if user is authenticated and is not AnonymousUser
        user = getattr(request, 'user', None)
        if user is None:
            return False
        
        # Check if it's a valid MongoDB user (has username attribute and is not AnonymousUser)
        if hasattr(user, 'username') and user.username != 'AnonymousUser':
            return True
            
        return False

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data.copy()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    image_file = request.FILES.get('image')

    if not username or not email or not password:
        return Response({'error': 'Missing required fields.'}, status=400)
    if User.objects(username=username).first():
        return Response({'error': 'Username already exists.'}, status=400)
    if User.objects(email=email).first():
        return Response({'error': 'Email already exists.'}, status=400)

    # Create user
    user = User(username=username, email=email, password=password, created_at=datetime.utcnow())
    user.save()

    # Create wallet with initial balance
    public_key, private_key_list = generate_wallet()
    wallet = Wallet(user=user, public_key=public_key, private_key=json.dumps(private_key_list), balance=1000.0, network='Solana Devnet')
    wallet.save()

    # Register face data if image provided
    if image_file:
        image = face_recognition.load_image_file(image_file)
        encodings = face_recognition.face_encodings(image)
        if not encodings:
            print("No face found in image.")
            return Response({'error': 'No face found in image.'}, status=400)
        encoding_array = encodings[0]
        face_data = FaceData(user=user, encoding=encoding_array.tobytes())
        face_data.save()

    # Generate a simple token and save to database
    token = secrets.token_hex(32)
    token_obj = Token(user=user, token=token)
    token_obj.save()

    return Response({
        'user': {'id': str(user.id), 'username': username, 'email': email},
        'wallet': {
            'public_key': public_key,
            'balance': wallet.balance,
            'network': wallet.network
        },
        'token': token
    })

# Simple token authentication using database
class SimpleTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        print(f"Auth header: {auth_header}")  # Debug
        
        if not auth_header:
            return None
            
        try:
            token_type, token = auth_header.split(' ', 1)
            if token_type.lower() != 'token':
                return None
        except ValueError:
            return None
        
        print(f"Looking for token: {token}")  # Debug
        
        # Look up token in database
        try:
            token_obj = Token.objects(token=token).first()
            if token_obj and token_obj.user:
                print(f"Found user: {token_obj.user.username}")  # Debug
                return (token_obj.user, token)  # Return (user, auth) tuple
            else:
                print("Token not found in database")  # Debug
        except Exception as e:
            print(f"Error finding token: {e}")
        
        print("No matching token found")  # Debug
        return None

    def authenticate_header(self, request):
        return 'Token'

@api_view(['POST'])
@authentication_classes([SimpleTokenAuthentication])
@permission_classes([IsMongoAuthenticated])
def login(request):
    data = request.data.copy()
    username = data.get('username')
    password = data.get('password')
    user = User.objects(username=username, password=password).first()
    if not user:
        return Response({'error': 'Invalid credentials.'}, status=401)
    
    # Check if token already exists for user
    token_obj = Token.objects(user=user).first()
    if not token_obj:
        # Create new token if none exists
        token = secrets.token_hex(32)
        token_obj = Token(user=user, token=token)
        token_obj.save()
    
    return Response({'token': token_obj.token, 'user': {'id': str(user.id), 'username': user.username, 'email': user.email}})

@api_view(['POST'])
@authentication_classes([SimpleTokenAuthentication])
@permission_classes([IsMongoAuthenticated])
def create_wallet(request):
    user = request.user
    if Wallet.objects(user=user).first():
        return Response({'error': 'Wallet already exists.'}, status=400)
    public_key, private_key_list = generate_wallet()
    wallet = Wallet(user=user, public_key=public_key, private_key=json.dumps(private_key_list), balance=1000.0, network='Solana Devnet')
    wallet.save()
    return Response({'wallet': {'public_key': public_key, 'balance': wallet.balance, 'network': wallet.network}})

@api_view(['GET'])
@authentication_classes([SimpleTokenAuthentication])
@permission_classes([IsMongoAuthenticated])
def get_wallet(request):
    try:
        user = request.user
        print(f"Get wallet for user: {user}, type: {type(user)}")  # Debug log
        
        if not user or not hasattr(user, 'username'):
            return Response({'error': 'Invalid user authentication.'}, status=401)
        
        wallet = Wallet.objects(user=user).first()
        if not wallet:
            return Response({'error': 'No wallet found.'}, status=404)
        
        return Response({
            'wallet': {
                'public_key': wallet.public_key, 
                'balance': wallet.balance, 
                'network': wallet.network
            }
        })
    except Exception as e:
        print(f"Error in get_wallet: {e}")  # Debug log
        return Response({'error': f'Database error: {str(e)}'}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_wallet_by_id(request, user_id):
    user = User.objects(id=user_id).first()
    if not user:
        return Response({'error': 'User not found.'}, status=404)
    wallet = Wallet.objects(user=user).first()
    if not wallet:
        return Response({'error': 'No wallet found.'}, status=404)
    return Response({'wallet': {'public_key': wallet.public_key, 'balance': wallet.balance, 'network': wallet.network}})

@api_view(['POST'])
def register_face(request):
    user_id = request.data.get("user_id")
    image_file = request.FILES.get("image")

    if not image_file:
        return Response({"error": "No image provided."}, status=400)

    image = face_recognition.load_image_file(image_file)
    encodings = face_recognition.face_encodings(image)

    if not encodings:
        return Response({"error": "No face found in image."}, status=400)

    encoding_array = encodings[0]
    user = User.objects.get(id=user_id)
    FaceData.objects.update_or_create(user=user, defaults={
        "encoding": encoding_array.tobytes()
    })
    return Response({"message": "Face registered."})



# Remove Solana-related imports
# from solders.keypair import Keypair
# from solana.rpc.api import Client
# from solana.transaction import Transaction
# from solana.system_program import transfer, TransferParams
# from solana.publickey import PublicKey

# Remove any Solana client or transaction code (already replaced by dummy logic)

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    # This view is tied to Django ORM TokenAuthentication.
    # For a stateless token, you'd invalidate it here.
    # For this demo, we'll just remove it from the in-memory store.
    # In a real app, you'd use a JWT or similar.
    token_key = request.headers.get('Authorization', '').replace('Token ', '')
    if token_key in USER_TOKENS:
        del USER_TOKENS[token_key]
    return Response({'message': 'Logged out successfully.'})

@api_view(['GET'])
@permission_classes([AllowAny])
def user_info(request):
    try:
        custom_user = User.objects.get(username=request.user.username)
        wallet = Wallet.objects.filter(user=custom_user).first()
        return Response({
            'username': custom_user.username,
            'email': custom_user.email,
            'wallet': WalletSerializer(wallet).data if wallet else None
        })
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=404)

@api_view(['GET'])
@permission_classes([AllowAny])
def wallet_info(request):
    try:
        custom_user = User.objects.get(username=request.user.username)
        wallet = Wallet.objects.filter(user=custom_user).first()
        if not wallet:
            return Response({'error': 'No wallet found.'}, status=404)
        return Response(WalletSerializer(wallet).data)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=404)

@api_view(['GET'])
@permission_classes([AllowAny])
def crypto_list(request):
    # Dummy supported cryptos
    return Response({
        'cryptos': [
            {'symbol': 'DUM', 'name': 'DummyCoin'},
            {'symbol': 'BTC', 'name': 'Bitcoin (Simulated)'},
            {'symbol': 'ETH', 'name': 'Ethereum (Simulated)'}
        ]
    })

@api_view(['POST'])
@authentication_classes([SimpleTokenAuthentication])
@permission_classes([IsMongoAuthenticated])
def initiate_payment(request):
    user = request.user
    wallet = Wallet.objects(user=user).first()
    if not wallet:
        return Response({'error': 'No wallet found.'}, status=404)
        
    to_address = request.data.get('to_address')
    amount = float(request.data.get('amount', 0))
    # Dummy face auth check (should be improved)
    face_ok = request.data.get('face_ok', False)
    if not face_ok:
        return Response({'error': 'Face authentication failed.'}, status=403)
    if wallet.balance < amount:
        return Response({'error': 'Insufficient balance.'}, status=400)
        
    wallet.balance -= amount
    wallet.save()
    # txn = Transaction.objects.create(wallet=wallet, to_address=to_address, amount=amount, status='success')
    return Response({'message': 'Payment successful', 'transaction_id': 'dummy_txn_id'})

@api_view(['GET'])
@permission_classes([AllowAny])
def payment_status(request):
    try:
        custom_user = User.objects.get(username=request.user.username)
        txn_id = request.query_params.get('transaction_id')
        # txn = Transaction.objects.filter(id=txn_id, wallet__user=custom_user).first()
        if not txn_id:
            return Response({'error': 'Transaction ID not provided.'}, status=400)
        return Response({'status': 'success', 'amount': 100.0, 'to_address': 'dummy_address', 'timestamp': datetime.utcnow().isoformat()})
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=404)

@api_view(['GET'])
@authentication_classes([SimpleTokenAuthentication])
@permission_classes([IsMongoAuthenticated])
def transaction_history(request):
    user = request.user
    wallet = Wallet.objects(user=user).first()
    if not wallet:
        return Response({'error': 'No wallet found.'}, status=404)
    txns = Transaction.objects(wallet=wallet).order_by('-timestamp')
    txn_list = [
        {
            'id': str(txn.id),
            'to_address': txn.to_address,
            'amount': txn.amount,
            'timestamp': txn.timestamp,
            'status': txn.status
        }
        for txn in txns
    ]
    return Response({'transactions': txn_list})

@api_view(['POST'])
@authentication_classes([SimpleTokenAuthentication])
@permission_classes([IsMongoAuthenticated])
def face_auth(request):
    user = request.user
    image_file = request.FILES.get('image')
    if not image_file:
        return Response({'error': 'No image provided.'}, status=400)
    face_data = FaceData.objects(user=user).first()
    if not face_data:
        return Response({'error': 'No face data registered.'}, status=404)
    image = face_recognition.load_image_file(image_file)
    encodings = face_recognition.face_encodings(image)
    if not encodings:
        return Response({'error': 'No face found in image.'}, status=400)
    encoding_array = encodings[0]
    stored_encoding = np.frombuffer(face_data.encoding, dtype=np.float64)
    match = face_recognition.compare_faces([stored_encoding], encoding_array)[0]
    return Response({'face_ok': match})

@api_view(['POST'])
@authentication_classes([SimpleTokenAuthentication])
@permission_classes([IsMongoAuthenticated])
def buy_crypto(request):
    user = request.user
    wallet = Wallet.objects(user=user).first()
    if not wallet:
        return Response({'error': 'No wallet found.'}, status=404)
    amount = float(request.data.get('amount', 0))
    if amount <= 0:
        return Response({'error': 'Invalid amount.'}, status=400)
    wallet.balance += amount
    wallet.save()
    return Response({'message': 'Crypto bought successfully.', 'balance': wallet.balance})

@api_view(['POST'])
@authentication_classes([SimpleTokenAuthentication])
@permission_classes([IsMongoAuthenticated])
def sell_crypto(request):
    user = request.user
    wallet = Wallet.objects(user=user).first()
    if not wallet:
        return Response({'error': 'No wallet found.'}, status=404)
    amount = float(request.data.get('amount', 0))
    if amount <= 0:
        return Response({'error': 'Invalid amount.'}, status=400)
    if wallet.balance < amount:
        return Response({'error': 'Insufficient balance.'}, status=400)
    wallet.balance -= amount
    wallet.save()
    return Response({'message': 'Crypto sold successfully.', 'balance': wallet.balance})

@api_view(['POST'])
@authentication_classes([SimpleTokenAuthentication])
@permission_classes([IsMongoAuthenticated])
def transfer_to_merchant(request):
    user = request.user
    wallet = Wallet.objects(user=user).first()
    if not wallet:
        return Response({'error': 'No wallet found.'}, status=404)
    merchant_name = request.data.get('merchant_name')
    amount = float(request.data.get('amount', 0))
    face_ok = request.data.get('face_ok', False)
    if not merchant_name or amount <= 0:
        return Response({'error': 'Invalid merchant or amount.'}, status=400)
    if not face_ok:
        return Response({'error': 'Face authentication failed.'}, status=403)
    if wallet.balance < amount:
        return Response({'error': 'Insufficient balance.'}, status=400)
    merchant_wallet = MerchantWallet.objects(merchant_name=merchant_name).first()
    if not merchant_wallet:
        return Response({'error': 'Merchant wallet not found.'}, status=404)
    # Transfer
    wallet.balance -= amount
    merchant_wallet.balance += amount
    wallet.save()
    merchant_wallet.save()
    txn = Transaction(wallet=wallet, to_address=merchant_wallet.public_key, amount=amount, status='success')
    txn.save()
    return Response({'message': 'Payment successful', 'transaction_id': str(txn.id)})

@api_view(['POST'])
@permission_classes([AllowAny])
def create_merchant_wallet(request):
    merchant_name = request.data.get('merchant_name')
    if not merchant_name:
        return Response({'error': 'Merchant name required.'}, status=400)
    if MerchantWallet.objects(merchant_name=merchant_name).first():
        return Response({'error': 'Merchant wallet already exists.'}, status=400)
    public_key, private_key_list = generate_wallet()
    merchant_wallet = MerchantWallet(
        merchant_name=merchant_name,
        public_key=public_key,
        private_key=json.dumps(private_key_list),
        balance=0.0,
        network='Solana Devnet'
    )
    merchant_wallet.save()
    return Response({'merchant_wallet': {
        'merchant_name': merchant_name,
        'public_key': public_key,
        'balance': merchant_wallet.balance,
        'network': merchant_wallet.network
    }})

# Auto-create curve-merchant wallet if it doesn't exist
def ensure_curve_merchant_exists():
    if not MerchantWallet.objects(merchant_name='curve-merchant').first():
        public_key, private_key_list = generate_wallet()
        merchant_wallet = MerchantWallet(
            merchant_name='curve-merchant',
            public_key=public_key,
            private_key=json.dumps(private_key_list),
            balance=0.0,
            network='Solana Devnet'
        )
        merchant_wallet.save()
        print("Created curve-merchant wallet")

# Call this when the server starts
try:
    ensure_curve_merchant_exists()
except Exception as e:
    print(f"Error creating curve-merchant: {e}")

@api_view(['GET'])
@permission_classes([AllowAny])
def get_merchant_wallet(request, merchant_name):
    merchant_wallet = MerchantWallet.objects(merchant_name=merchant_name).first()
    if not merchant_wallet:
        return Response({'error': 'Merchant wallet not found.'}, status=404)
    return Response({'merchant_wallet': {
        'merchant_name': merchant_wallet.merchant_name,
        'public_key': merchant_wallet.public_key,
        'balance': merchant_wallet.balance,
        'network': merchant_wallet.network
    }})

@api_view(["POST"])
@authentication_classes([SimpleTokenAuthentication])
@permission_classes([IsMongoAuthenticated])
def place_order(request):
    user = request.user
    order_type = request.data.get("type")
    symbol = request.data.get("symbol")
    price = float(request.data.get("price", 0))
    amount = float(request.data.get("amount", 0))
    if order_type not in ["buy", "sell"] or symbol not in SYMBOLS or price <= 0 or amount <= 0:
        return Response({"error": "Invalid order data."}, status=400)
    order = Order(user=user, type=order_type, symbol=symbol, price=price, amount=amount)
    order.save()
    return Response({"message": "Order placed.", "order_id": str(order.id)})

@api_view(["GET"])
@permission_classes([AllowAny])
def get_order_book(request):
    symbol = request.query_params.get("symbol", "ARC")
    orders = Order.objects(symbol=symbol, status="open").order_by("-timestamp")
    order_list = [
        {
            "id": str(o.id),
            "type": o.type,
            "symbol": o.symbol,
            "price": o.price,
            "amount": o.amount,
            "timestamp": o.timestamp,
        }
        for o in orders
    ]
    return Response({"orders": order_list})

@api_view(["GET"])
@permission_classes([AllowAny])
def get_prices(request):
    # Simulate prices for each symbol
    prices = {s: round(random.uniform(10, 100), 2) for s in SYMBOLS}
    return Response({"prices": prices})

@api_view(['GET'])
@permission_classes([AllowAny])
def debug_auth(request):
    """Debug endpoint to check authentication status"""
    auth_header = request.META.get('HTTP_AUTHORIZATION', 'No auth header')
    user = getattr(request, 'user', 'No user')
    user_type = type(user).__name__
    
    # Check if token exists in database
    token_exists = False
    total_tokens = Token.objects.count()
    
    if auth_header.startswith('Token '):
        token = auth_header[6:]
        token_obj = Token.objects(token=token).first()
        token_exists = token_obj is not None
    
    return Response({
        'auth_header': auth_header,
        'user': str(user),
        'user_type': user_type,
        'token_exists_in_db': token_exists,
        'total_tokens_in_db': total_tokens
    })

