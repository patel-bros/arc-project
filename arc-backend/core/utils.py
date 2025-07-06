from solana.keypair import Keypair
from solana.rpc.api import Client
import base64

client = Client("https://api.devnet.solana.com")

def generate_wallet():
    keypair = Keypair()
    public_key = str(keypair.public_key)
    secret_key = base64.b64encode(bytes(keypair.secret_key)).decode()
    
    # Airdrop 1 SOL for free testing
    client.request_airdrop(keypair.public_key, 1000000000)

    return public_key, secret_key
