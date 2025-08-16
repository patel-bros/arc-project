import random
import string
import base64

def generate_wallet():
    """Generate a dummy wallet for development purposes"""
    # Generate a dummy public key
    public_key = 'dummy_' + ''.join(random.choices(string.ascii_letters + string.digits, k=44))
    
    # Generate a dummy secret key as a list of integers (simulating Solana keypair)
    secret_key_list = [random.randint(0, 255) for _ in range(32)]
    
    return public_key, secret_key_list
