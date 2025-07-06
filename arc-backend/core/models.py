from django.db import models


class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    public_key = models.CharField(max_length=200)
    secret_key = models.TextField()
    balance = models.FloatField(default=0.0)
    network = models.CharField(default="Solana Devnet", max_length=50)


class FaceData(models.Model):
    user = models.OneToOneField('User', on_delete=models.CASCADE)
    encoding = models.BinaryField()  # serialized numpy array

class Transaction(models.Model):
    wallet = models.ForeignKey('Wallet', on_delete=models.CASCADE)
    to_address = models.CharField(max_length=200)
    amount = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="success")

