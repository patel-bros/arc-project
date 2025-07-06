from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, Wallet
from .serializers import UserSerializer, WalletSerializer
from .utils import generate_wallet

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
