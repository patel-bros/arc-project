chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "ARC_PAYMENT_TRIGGER") {
    chrome.storage.local.set({ arc_order_amount: request.payload.amount }, () => {
      chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        width: 400,
        height: 600,
      });
    });
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
  }
});
