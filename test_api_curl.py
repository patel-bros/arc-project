#!/usr/bin/env python3
import json
import sys
import subprocess

def test_api_with_curl():
    """Test API endpoints using curl commands"""
    print("=== Testing Arc Backend API with curl ===\n")
    
    # Test 1: Register a new user
    print("1. Testing user registration...")
    registration_data = {
        "username": "apitest",
        "email": "apitest@example.com",
        "password": "testpass123"
    }
    
    cmd = [
        "curl", "-s", "-X", "POST", 
        "http://localhost:8000/api/register/",
        "-H", "Content-Type: application/json",
        "-d", json.dumps(registration_data)
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"Registration response: {result.stdout}")
            try:
                response_data = json.loads(result.stdout)
                token = response_data.get('token')
                if token:
                    print(f"✅ Registration successful! Token received: {token[:20]}...")
                    return token
                else:
                    print("❌ Registration failed - no token received")
            except json.JSONDecodeError:
                print(f"❌ Invalid JSON response: {result.stdout}")
        else:
            print(f"❌ curl command failed: {result.stderr}")
    except subprocess.TimeoutExpired:
        print("❌ Request timed out")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    return None

def test_login():
    """Test user login with existing sample user"""
    print("\n2. Testing user login...")
    login_data = {
        "username": "trader1",
        "password": "password123"
    }
    
    cmd = [
        "curl", "-s", "-X", "POST",
        "http://localhost:8000/api/login/",
        "-H", "Content-Type: application/json", 
        "-d", json.dumps(login_data)
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"Login response: {result.stdout}")
            try:
                response_data = json.loads(result.stdout)
                token = response_data.get('token')
                if token:
                    print(f"✅ Login successful! Token: {token[:20]}...")
                    return token
                else:
                    print("❌ Login failed - no token received")
            except json.JSONDecodeError:
                print(f"❌ Invalid JSON response: {result.stdout}")
        else:
            print(f"❌ curl command failed: {result.stderr}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    return None

def test_authenticated_endpoints(token):
    """Test authenticated endpoints"""
    print(f"\n3. Testing authenticated endpoints...")
    
    # Test portfolio endpoint
    print("Testing portfolio endpoint...")
    cmd = [
        "curl", "-s", "-X", "GET",
        "http://localhost:8000/api/portfolio/",
        "-H", f"Authorization: Bearer {token}",
        "-H", "Content-Type: application/json"
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"Portfolio response: {result.stdout}")
            try:
                response_data = json.loads(result.stdout)
                if 'wallets' in response_data:
                    print(f"✅ Portfolio endpoint working! Found {len(response_data['wallets'])} wallets")
                else:
                    print("❌ Portfolio endpoint failed - no wallets in response")
            except json.JSONDecodeError:
                print(f"❌ Invalid JSON response: {result.stdout}")
        else:
            print(f"❌ curl command failed: {result.stderr}")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_public_endpoints():
    """Test public endpoints"""
    print("\n4. Testing public endpoints...")
    
    # Test market data endpoint
    print("Testing market data endpoint...")
    cmd = [
        "curl", "-s", "-X", "GET",
        "http://localhost:8000/api/market-data/"
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"Market data response: {result.stdout}")
            try:
                response_data = json.loads(result.stdout)
                if 'market_data' in response_data:
                    market_data = response_data['market_data']
                    print(f"✅ Market data endpoint working! Found {len(market_data)} trading pairs")
                    for pair in market_data[:3]:  # Show first 3
                        print(f"  {pair['symbol']}: ${pair['price']} (24h: {pair['change_24h']:.2f}%)")
                else:
                    print("❌ Market data endpoint failed")
            except json.JSONDecodeError:
                print(f"❌ Invalid JSON response: {result.stdout}")
        else:
            print(f"❌ curl command failed: {result.stderr}")
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    print("Checking if curl is available...")
    try:
        subprocess.run(["curl", "--version"], capture_output=True, check=True)
        print("✅ curl is available\n")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ curl is not available. Please install curl or use Windows Subsystem for Linux.")
        return
    
    # Test public endpoints first
    test_public_endpoints()
    
    # Test registration
    token = test_api_with_curl()
    
    if not token:
        # Try login with existing user if registration failed
        token = test_login()
    
    if token:
        test_authenticated_endpoints(token)
    else:
        print("\n❌ Authentication failed - skipping authenticated endpoint tests")
    
    print("\n=== API Testing Complete ===")

if __name__ == "__main__":
    main()
