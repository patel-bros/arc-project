window.addEventListener("message", function (event) {
  if (event.source !== window) return;
  if (event.data.type && event.data.type === "ARC_PAYMENT_REQUEST") {
    chrome.runtime.sendMessage({
      type: "ARC_PAYMENT_TRIGGER",
      payload: event.data.payload,
    });
  }
});
