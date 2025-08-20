// Keep track of extension tab for payment flow
let paymentTabId = null;

console.log('=== ARC EXTENSION BACKGROUND SCRIPT LOADED ===');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('=== BACKGROUND RECEIVED MESSAGE ===');
  console.log('Request:', request);
  console.log('Sender:', sender);
  
  if (request.type === 'ARC_OPEN_TAB') {
    const targetUrl = request.url || chrome.runtime.getURL('popup.html');
    // Try to find existing tab with our URL
    chrome.tabs.query({ url: chrome.runtime.getURL('popup.html') + '*' }, (tabs) => {
      if (tabs && tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { active: true, url: targetUrl });
        sendResponse && sendResponse({ reused: true, tabId: tabs[0].id });
      } else {
        chrome.tabs.create({ url: targetUrl, active: true }, (tab) => {
          paymentTabId = tab.id;
          sendResponse && sendResponse({ opened: true, tabId: tab.id });
        });
      }
    });
    return true; // async response
  }

  if (request.type === "ARC_PAYMENT_TRIGGER") {
    console.log('=== PAYMENT TRIGGER RECEIVED ===');
    console.log('Payment amount:', request.payload.amount);
    
    // Store the payment amount
    chrome.storage.local.set({ arc_order_amount: request.payload.amount }, () => {
      console.log('Amount stored in background:', request.payload.amount);
      
      // Set badge to indicate payment pending
      chrome.action.setBadgeText({ text: "PAY" });
      chrome.action.setBadgeBackgroundColor({ color: "#FF6B35" });
      console.log('Badge set to PAY');
      
      // Open the extension as a new window
      console.log('Attempting to create popup window...');
      chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        width: 400,
        height: 600,
        focused: true
      }, (window) => {
        console.log('Extension window created successfully:', window);
        // Store the tab ID from the window
        if (window && window.tabs && window.tabs.length > 0) {
          paymentTabId = window.tabs[0].id;
          console.log('Stored paymentTabId:', paymentTabId);
        }
        if (chrome.runtime.lastError) {
          console.error('Error creating window:', chrome.runtime.lastError);
        }
      });
    });
    
    // Send response back to content script
    sendResponse({ success: true });
  }
  
  if (request.type === "ARC_PAYMENT_STATUS") {
    // Relay payment status to the merchant site
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: (status) => {
            window.postMessage({ type: 'ARC_PAYMENT_STATUS', payload: { status } }, '*');
          },
          args: [request.payload.status]
        });
      }
    });
    
    // Clear the badge after payment
    chrome.action.setBadgeText({ text: "" });
  }
  
  if (request.type === "CLEAR_PAYMENT_BADGE") {
    chrome.action.setBadgeText({ text: "" });
  }
  
  if (request.type === "CLOSE_EXTENSION_TAB") {
    console.log('=== CLOSE EXTENSION TAB REQUEST ===');
    console.log('Current paymentTabId:', paymentTabId);
    
    // Close the current extension tab
    if (paymentTabId) {
      chrome.tabs.remove(paymentTabId, () => {
        console.log('Extension tab closed after payment');
        paymentTabId = null;
        if (chrome.runtime.lastError) {
          console.error('Error closing tab:', chrome.runtime.lastError);
        }
      });
    } else {
      // Fallback: close any extension tabs
      console.log('No paymentTabId, searching for extension tabs...');
      chrome.tabs.query({ url: chrome.runtime.getURL("popup.html") + "*" }, (tabs) => {
        console.log('Found extension tabs:', tabs.length);
        tabs.forEach((tab) => {
          console.log('Closing tab:', tab.id);
          chrome.tabs.remove(tab.id);
        });
      });
    }
    sendResponse({ closed: true });
  }
});
