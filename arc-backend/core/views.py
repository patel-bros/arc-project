from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, Wallet
from .serializers import UserSerializer, WalletSerializer
from .utils import generate_wallet
import face_recognition
import numpy as np
from .models import FaceData
from solana.keypair import Keypair
from solana.rpc.api import Client
from solana.transaction import Transaction
from solana.system_program import transfer, TransferParams
from solana.publickey import PublicKey

import base64
import numpy as np
import face_recognition

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)

@api_view(['POST'])
def create_wallet(request):
    user_id = request.data.get('user_id')
    user = User.objects.get(id=user_id)
    address, private_key = generate_wallet()
    wallet = Wallet.objects.create(user=user, wallet_address=address, private_key=private_key)
    return Response(WalletSerializer(wallet).data)

@api_view(['GET'])
def get_wallet(request, user_id):
    wallet = Wallet.objects.get(user_id=user_id)
    return Response(WalletSerializer(wallet).data)

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



client = Client("https://api.devnet.solana.com")

@api_view(['POST'])
def send_payment(request):
    user_id = request.data.get("user_id")
    to_address = request.data.get("to_address")
    amount = float(request.data.get("amount"))
    image_file = request.FILES.get("image")

    user = User.objects.get(id=user_id)
    wallet = Wallet.objects.get(user=user)
    face_data = FaceData.objects.get(user=user)

    # Face verification
    image = face_recognition.load_image_file(image_file)
    encoding = face_recognition.face_encodings(image)
    if not encoding:
        return Response({"error": "No face detected"}, status=400)

    known_encoding = np.frombuffer(face_data.encoding, dtype=np.float64)
    is_match = face_recognition.compare_faces([known_encoding], encoding[0])[0]
    if not is_match:
        return Response({"error": "Face mismatch"}, status=403)

    # Prepare wallet keys
    secret_key_bytes = base64.b64decode(wallet.secret_key)
    keypair = Keypair.from_secret_key(secret_key_bytes)

    # Transaction
    txn = Transaction().add(
        transfer(
            TransferParams(
                from_pubkey=keypair.public_key,
                to_pubkey=PublicKey(to_address),
                lamports=int(amount * 1e9),
            )
        )
    )
    result = client.send_transaction(txn, keypair)

    return Response({
        "message": "✅ Payment Successful",
        "transaction": result['result'],
        "explorer": f"https://explorer.solana.com/tx/{result['result']}?cluster=devnet"
    })

