chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "ARC_PAYMENT_TRIGGER") {
    chrome.storage.local.set({ arc_order_amount: request.payload.amount }, () => {
      chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        width: 400,
        height: 600,
        top: Math.round(screen.height / 2 - 300),
        left: Math.round(screen.width / 2 - 200)
      });
    });
  }
});
