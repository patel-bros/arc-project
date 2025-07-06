from web3 import Web3
import secrets

def generate_wallet():
    private_key = "0x" + secrets.token_hex(32)
    w3 = Web3()
    account = w3.eth.account.from_key(private_key)
    return account.address, private_key
