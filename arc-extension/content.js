console.log('=== ARC EXTENSION CONTENT SCRIPT LOADED (ENHANCED) ===');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[ARC CONTENT] Message from background:', message);
  
  if (message.type === 'ARC_PAYMENT_STATUS') {
    console.log('[ARC CONTENT] Relaying payment status to webpage:', message.payload);
    // Forward the payment status to the webpage
    window.postMessage({
      type: 'ARC_PAYMENT_STATUS',
      payload: message.payload
    }, '*');
    sendResponse({ received: true });
  }
});

// Inject (or ensure) a hidden anchor we can programmatically click (user gesture proxy)
(function ensureLauncher() {
  if (document.getElementById('arc-extension-launcher')) return;
  const a = document.createElement('a');
  a.id = 'arc-extension-launcher';
  a.href = chrome.runtime.getURL('popup.html?mode=pay');
  a.target = '_blank';
  a.style.display = 'none';
  document.body.appendChild(a);
})();

// Utility: open extension in new tab with params
function openArcExtension(params = {}) {
  const qp = new URLSearchParams(params).toString();
  const url = chrome.runtime.getURL('popup.html' + (qp ? ('?' + qp) : ''));
  chrome.runtime.sendMessage({ type: 'ARC_DEBUG', msg: 'Request open extension', url });
  chrome.tabs ? chrome.runtime.sendMessage({ type: 'ARC_OPEN_TAB', url }) : window.open(url, '_blank');
}

// Listen for postMessage payment requests
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  const data = event.data || {};
  if (data.type === 'ARC_PAYMENT_REQUEST') {
    console.log('[ARC CONTENT] Payment request received', data);
    try {
      chrome.runtime.sendMessage({ type: 'ARC_PAYMENT_TRIGGER', payload: data.payload });
    } catch (e) {
      console.warn('Background message failed, fallback open', e);
      openArcExtension({ amount: data.payload?.amount || 0 });
    }
  }
});

// Heuristic: attach to any button with text containing "pay with arc"
function attachDynamicPayObservers() {
  const matchBtn = (el) => el.tagName === 'BUTTON' && /pay\s*with\s*arc/i.test(el.textContent);
  const enhance = (btn) => {
    if (btn.dataset.arcBound) return;
    btn.dataset.arcBound = '1';
    btn.addEventListener('click', () => {
      const amount = window.__ARC_CART_TOTAL || parseFloat(btn.getAttribute('data-amount')) || 0;
      window.postMessage({
        type: 'ARC_PAYMENT_REQUEST',
        payload: { amount, merchant_id: 'curve-merchant', ts: Date.now() }
      }, '*');
    });
  };
  document.querySelectorAll('button').forEach(b => { if (matchBtn(b)) enhance(b); });
  const mo = new MutationObserver((muts) => {
    muts.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType === 1) {
        if (n.tagName === 'BUTTON') { if (matchBtn(n)) enhance(n); }
        n.querySelectorAll && n.querySelectorAll('button').forEach(b => { if (matchBtn(b)) enhance(b); });
      }
    }));
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
}
attachDynamicPayObservers();

// Expose a small API hook for merchant pages
window.ArcPay = {
  pay: ({ amount, items }) => {
    window.postMessage({ type: 'ARC_PAYMENT_REQUEST', payload: { amount, items, merchant_id: 'curve-merchant', ts: Date.now() } }, '*');
  }
};
