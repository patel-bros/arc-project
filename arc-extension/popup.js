document.addEventListener('DOMContentLoaded', async () => {
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
    const res = await fetch('http://localhost:8000/api/wallet/', {
      headers: { 'Authorization': `Token ${token}` }
    });
    return await res.json();
  }
  async function fetchCryptos() {
    const res = await fetch('http://localhost:8000/api/cryptos/');
    return (await res.json()).cryptos;
  }
  async function login(username, password) {
    const res = await fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.token) {
      await setToken(data.token);
      return data.token;
    } else {
      throw new Error('Login failed');
    }
  }
  async function register(username, email, password) {
    const res = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (data.token) {
      await setToken(data.token);
      return data.token;
    } else {
      throw new Error('Register failed');
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
    if (data.arc_order_amount) {
      curveAmount = data.arc_order_amount;
      paymentAmountEl.innerText = 'Order Amount: ' + curveAmount + ' ARC';
      showSection('payment-section');
      // Start camera
      const video = document.getElementById('video');
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
      });
      faceAuthBtn.onclick = async () => {
        paymentStatus.innerText = 'Authenticating...';
        // Capture frame
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        canvas.toBlob(async (blob) => {
          const token = await getToken();
          const faceOk = await faceAuth(token, blob);
          if (!faceOk) {
            paymentStatus.innerText = 'Face authentication failed.';
            chrome.runtime.sendMessage({ type: 'ARC_PAYMENT_STATUS', payload: { status: 'failed' } });
            return;
          }
          // For demo, use merchant_name = 'curve-merchant'
          const result = await manualTransfer(token, 'curve-merchant', curveAmount);
          if (result.message) {
            paymentStatus.innerText = result.message;
            chrome.runtime.sendMessage({ type: 'ARC_PAYMENT_STATUS', payload: { status: 'success' } });
          } else {
            paymentStatus.innerText = result.error || 'Payment failed.';
            chrome.runtime.sendMessage({ type: 'ARC_PAYMENT_STATUS', payload: { status: 'failed' } });
          }
        }, 'image/jpeg');
      };
      return;
    }
    // If not from Curve, show login/wallet as usual
    initWalletFlow();
  });

  async function initWalletFlow() {
    let token = await getToken();
    if (token) {
      showSection('wallet-section');
      const wallet = await fetchWallet(token);
      addressEl.innerText = 'Wallet: ' + wallet.public_key;
      balanceEl.innerText = 'Balance: ' + wallet.balance;
      const cryptos = await fetchCryptos();
      document.getElementById('crypto-list').innerHTML = cryptos.map(c => `<div>${c.symbol}: ${c.name}</div>`).join('');
      manualReceiveAddress.innerText = wallet.public_key;
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
