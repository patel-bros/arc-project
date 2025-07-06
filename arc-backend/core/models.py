from django.db import models


class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    wallet_address = models.CharField(max_length=200)
    private_key = models.TextField()
    network = models.CharField(max_length=50, default="Polygon")
    balance = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
