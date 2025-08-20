document.addEventListener('DOMContentLoaded', async () => {
  // Clear payment badge when popup opens
  chrome.runtime.sendMessage({ type: 'CLEAR_PAYMENT_BADGE' });
  
  // Elements
  const addressEl = document.getElementById('address');
  const balanceEl = document.getElementById('balance');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const toggleAuthMode = document.getElementById('toggleAuthMode');
  const loginSection = document.getElementById('login-section');
  const walletSection = document.getElementById('wallet-section');
  const paymentSection = document.getElementById('payment-section');
  const paymentAmountEl = document.getElementById('payment-amount');
  const faceAuthBtn = document.getElementById('faceAuthBtn');
  const paymentStatus = document.getElementById('paymentStatus');
  const showManualTransfer = document.getElementById('showManualTransfer');
  const manualSection = document.getElementById('manual-section');
  const manualToAddress = document.getElementById('manualToAddress');
  const manualAmount = document.getElementById('manualAmount');
  const manualSendBtn = document.getElementById('manualSendBtn');
  const manualReceiveAddress = document.getElementById('manualReceiveAddress');
  const manualBackBtn = document.getElementById('manualBackBtn');
  const manualStatus = document.getElementById('manualStatus');
  const showMerchantWallet = document.getElementById('showMerchantWallet');
  const merchantSection = document.getElementById('merchant-section');
  const merchantName = document.getElementById('merchantName');
  const merchantFetchBtn = document.getElementById('merchantFetchBtn');
  const merchantWalletInfo = document.getElementById('merchantWalletInfo');
  const merchantBackBtn = document.getElementById('merchantBackBtn');

  // Auth mode toggle
  let isRegisterMode = false;
  function setAuthMode(registerMode) {
    isRegisterMode = registerMode;
    document.getElementById('email').style.display = registerMode ? '' : 'none';
    registerBtn.style.display = registerMode ? '' : 'none';
    loginBtn.style.display = registerMode ? 'none' : '';
    toggleAuthMode.innerText = registerMode ? 'Already have an account? Login' : "Don't have an account? Register";
    document.getElementById('loginError').innerText = '';
  }
  if (toggleAuthMode) toggleAuthMode.onclick = (e) => {
    e.preventDefault();
    setAuthMode(!isRegisterMode);
  };
  setAuthMode(false);

  // Token helpers
  async function getToken() {
    return new Promise(resolve => {
      chrome.storage.local.get(['token'], result => resolve(result.token));
    });
  }
  async function setToken(token) {
    return new Promise(resolve => {
      chrome.storage.local.set({ token }, resolve);
    });
  }
  async function clearToken() {
    return new Promise(resolve => {
      chrome.storage.local.remove('token', resolve);
    });
  }

  // API helpers
  async function fetchWallet(token) {
    try {
      console.log('Fetching wallet with token:', token); // Debug log
      const res = await fetch('http://localhost:8000/api/wallet/', {
        method: 'GET',
        headers: { 
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Wallet fetch response status:', res.status); // Debug log
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Wallet API response:', data); // Debug log
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data.wallet; // Return the wallet object from the response
    } catch (error) {
      console.error('fetchWallet error:', error);
      return { 
        public_key: 'Error: ' + error.message, 
        balance: 'Error loading',
        network: 'Error'
      };
    }
  }
  async function fetchCryptos() {
    try {
      const res = await fetch('http://localhost:8000/api/cryptos/');
      const data = await res.json();
      console.log('Cryptos API response:', data); // Debug log
      return data.cryptos || [];
    } catch (error) {
      console.error('fetchCryptos error:', error);
      return []; // Return empty array on error
    }
  }
  async function login(username, password) {
    try {
      const res = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      console.log('Login response:', data); // Debug log
      
      if (data.token) {
        await setToken(data.token);
        return data.token;
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  async function register(username, email, password) {
    try {
      const res = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      console.log('Register response:', data); // Debug log
      
      if (data.token) {
        await setToken(data.token);
        return data.token;
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }
  async function logout(token) {
    await fetch('http://localhost:8000/api/logout/', {
      method: 'POST',
      headers: { 'Authorization': `Token ${token}` }
    });
    await clearToken();
  }
  async function faceAuth(token, imageData) {
    const formData = new FormData();
    formData.append('image', imageData);
    const res = await fetch('http://localhost:8000/api/face-auth/', {
      method: 'POST',
      headers: { 'Authorization': `Token ${token}` },
      body: formData
    });
    return (await res.json()).face_ok;
  }
  async function initiatePayment(token, toAddress, amount, faceOk) {
    const res = await fetch('http://localhost:8000/api/payment/initiate/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ to_address: toAddress, amount, face_ok: faceOk })
    });
    return await res.json();
  }
  async function manualTransfer(token, toAddress, amount) {
    const res = await fetch('http://localhost:8000/api/transfer/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ merchant_name: toAddress, amount, face_ok: true })
    });
    return await res.json();
  }
  async function fetchMerchantWallet(merchantName) {
    const res = await fetch(`http://localhost:8000/api/merchant/${merchantName}/`);
    return await res.json();
  }

  // Section helpers
  function showSection(sectionId) {
    loginSection.style.display = 'none';
    walletSection.style.display = 'none';
    paymentSection.style.display = 'none';
    manualSection.style.display = 'none';
    merchantSection.style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
  }

  // Payment trigger from Curve
  let curveAmount = null;
  chrome.storage.local.get('arc_order_amount', (data) => {
    console.log('Storage data:', data); // Debug log
    if (data.arc_order_amount) {
      curveAmount = parseFloat(data.arc_order_amount);
      console.log('Curve amount:', curveAmount); // Debug log
      
      // Create payment amount display if it doesn't exist
      let paymentAmountEl = document.getElementById('payment-amount');
      if (!paymentAmountEl) {
        paymentAmountEl = document.createElement('p');
        paymentAmountEl.id = 'payment-amount';
        const paymentSection = document.getElementById('payment-section');
        if (paymentSection) {
          paymentSection.insertBefore(paymentAmountEl, paymentSection.firstChild);
        }
      }
      
      if (paymentAmountEl) {
        paymentAmountEl.innerText = `Order Amount: ${curveAmount} ARC`;
        paymentAmountEl.style.fontSize = '18px';
        paymentAmountEl.style.fontWeight = 'bold';
        paymentAmountEl.style.color = '#fff';
        paymentAmountEl.style.textAlign = 'center';
        paymentAmountEl.style.marginBottom = '20px';
      }
      
      showSection('payment-section');
      // Clear the storage after use
      chrome.storage.local.remove('arc_order_amount');
      
      // Start camera
      const video = document.getElementById('video');
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          video.srcObject = stream;
        }).catch((err) => {
          console.error('Camera access error:', err);
          paymentStatus.innerText = 'Camera access denied. Please enable camera.';
        });
      }
      
      faceAuthBtn.onclick = async () => {
        paymentStatus.innerText = 'Authenticating...';
        
        // Show current wallet info during face auth
        const token = await getToken();
        if (token) {
          const wallet = await fetchWallet(token);
          if (wallet) {
            paymentStatus.innerText = `Wallet: ${wallet.public_key?.substring(0, 20)}...\nBalance: ${wallet.balance} ARC\nAuthenticating...`;
          }
        }
        
        // Capture frame
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        canvas.toBlob(async (blob) => {
          if (!token) {
            paymentStatus.innerText = 'Please login first.';
            showSection('login-section');
            return;
          }
          try {
            const faceOk = await faceAuth(token, blob);
            if (!faceOk) {
              paymentStatus.innerText = 'Face authentication failed.';
              chrome.runtime.sendMessage({ type: 'ARC_PAYMENT_STATUS', payload: { status: 'failed' } });
              return;
            }
            
            paymentStatus.innerText = 'Processing payment...';
            
            // For demo, use merchant_name = 'curve-merchant'
            const result = await manualTransfer(token, 'curve-merchant', curveAmount);
            if (result.message) {
              // Show initial success message
              paymentStatus.innerText = `✅ Payment Successful!\nAmount: ${curveAmount} ARC\nTo: Curve Merchant`;
              
              // Send success message to Curve
              chrome.runtime.sendMessage({ 
                type: 'ARC_PAYMENT_STATUS', 
                payload: { 
                  status: 'success',
                  amount: curveAmount,
                  transactionId: result.transaction_id || Date.now()
                } 
              });
              
              // Update wallet balance immediately
              const updatedWallet = await fetchWallet(token);
              if (updatedWallet) {
                balanceEl.innerText = 'Balance: ' + updatedWallet.balance;
              }
              
              // Countdown timer for auto-close
              let countdown = 3;
              const countdownInterval = setInterval(() => {
                paymentStatus.innerText = `✅ Payment Successful!\nAmount: ${curveAmount} ARC\nTo: Curve Merchant\n\nClosing in ${countdown} seconds...`;
                countdown--;
                
                if (countdown < 0) {
                  clearInterval(countdownInterval);
                  console.log('Sending CLOSE_EXTENSION_TAB message...');
                  chrome.runtime.sendMessage({ type: 'CLOSE_EXTENSION_TAB' }, (response) => {
                    console.log('Close response:', response);
                    if (chrome.runtime.lastError) {
                      console.error('Close error:', chrome.runtime.lastError);
                      // Fallback: try to close window
                      window.close();
                    }
                  });
                }
              }, 1000);
              
            } else {
              paymentStatus.innerText = 'Payment failed: ' + (result.error || 'Unknown error');
              chrome.runtime.sendMessage({ type: 'ARC_PAYMENT_STATUS', payload: { status: 'failed' } });
            }
          } catch (error) {
            console.error('Payment error:', error);
            paymentStatus.innerText = 'Payment failed: ' + error.message;
            chrome.runtime.sendMessage({ type: 'ARC_PAYMENT_STATUS', payload: { status: 'failed' } });
          }
        }, 'image/jpeg');
      };
      return;
    }
    // If not from Curve, show login/wallet as usual
    initWalletFlow();
  });

  // Read query params for direct payment open
  const params = new URLSearchParams(location.search);
  const qpAmount = params.get('amount');
  if (qpAmount && paymentAmountEl) {
    paymentAmountEl.innerText = qpAmount;
    paymentSection?.classList.remove('hidden');
  }

  async function initWalletFlow() {
    let token = await getToken();
    if (token) {
      try {
        showSection('wallet-section');
        console.log('Token found:', token); // Debug log
        const wallet = await fetchWallet(token);
        console.log('Wallet data:', wallet); // Debug log
        
        if (wallet) {
          addressEl.innerText = 'Wallet: ' + (wallet.public_key || 'Not available');
          balanceEl.innerText = 'Balance: ' + (wallet.balance !== undefined ? wallet.balance : 'Not available');
        } else {
          addressEl.innerText = 'Wallet: Error loading';
          balanceEl.innerText = 'Balance: Error loading';
        }
        
        const cryptos = await fetchCryptos();
        document.getElementById('crypto-list').innerHTML = cryptos.map(c => `<div>${c.symbol}: ${c.name}</div>`).join('');
        
        if (manualReceiveAddress) {
          manualReceiveAddress.innerText = wallet.public_key || 'Not available';
        }
      } catch (error) {
        console.error('initWalletFlow error:', error);
        addressEl.innerText = 'Wallet: Error - ' + error.message;
        balanceEl.innerText = 'Balance: Error loading';
      }
    } else {
      showSection('login-section');
    }
  }

  if (loginBtn) loginBtn.onclick = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
      await login(username, password);
      await initWalletFlow();
    } catch (e) {
      document.getElementById('loginError').innerText = e.message || 'Login failed';
    }
  };
  if (registerBtn) registerBtn.onclick = async () => {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      await register(username, email, password);
      await initWalletFlow();
    } catch (e) {
      document.getElementById('loginError').innerText = e.message || 'Register failed';
    }
  };
  if (logoutBtn) logoutBtn.onclick = async () => {
    const token = await getToken();
    await logout(token);
    showSection('login-section');
  };
  if (showManualTransfer) showManualTransfer.onclick = () => {
    showSection('manual-section');
  };
  if (manualBackBtn) manualBackBtn.onclick = () => {
    showSection('wallet-section');
  };
  if (manualSendBtn) manualSendBtn.onclick = async () => {
    const token = await getToken();
    const toAddress = manualToAddress.value;
    const amount = manualAmount.value;
    manualStatus.innerText = 'Processing...';
    const result = await manualTransfer(token, toAddress, amount);
    if (result.message) {
      manualStatus.innerText = result.message;
    } else {
      manualStatus.innerText = result.error || 'Transfer failed.';
    }
  };
  if (showMerchantWallet) showMerchantWallet.onclick = () => {
    showSection('merchant-section');
  };
  if (merchantBackBtn) merchantBackBtn.onclick = () => {
    showSection('wallet-section');
  };
  if (merchantFetchBtn) merchantFetchBtn.onclick = async () => {
    const name = merchantName.value;
    merchantWalletInfo.innerText = 'Loading...';
    const result = await fetchMerchantWallet(name);
    if (result.merchant_wallet) {
      merchantWalletInfo.innerText = `Name: ${result.merchant_wallet.merchant_name}\nAddress: ${result.merchant_wallet.public_key}\nBalance: ${result.merchant_wallet.balance}`;
    } else {
      merchantWalletInfo.innerText = result.error || 'Not found.';
    }
  };
});
