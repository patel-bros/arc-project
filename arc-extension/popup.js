document.addEventListener("DOMContentLoaded", async () => {
  const addressEl = document.getElementById("address");
  const balanceEl = document.getElementById("balance");
  const payBtn = document.getElementById("payBtn");
  const amountEl = document.createElement("p");
  document.body.appendChild(amountEl);

  const userId = 1;
  const res = await fetch(`http://localhost:8000/api/get-wallet/${userId}/`);
  const data = await res.json();
  addressEl.innerText = "Wallet: " + data.wallet_address;
  balanceEl.innerText = "Balance: " + data.balance + " MATIC";

  // Read amount from localStorage
  chrome.storage.local.get("arc_order_amount", (data) => {
  const amount = data.arc_order_amount || 0;
  amountEl.innerText = "Order Amount: " + amount + " MATIC";



    payBtn.addEventListener("click", async () => {
      const confirmed = confirm("Confirm payment of " + orderAmount + " MATIC?");
      if (!confirmed) return;

      const txRes = await fetch("http://localhost:8000/api/send-payment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_user: userId,
          to_user: 999,
          amount: orderAmount
        }),
      });

      if (txRes.ok) {
        alert("Payment Success!");
        window.close();
      } else {
        alert("Payment Failed!");
      }
    });
  });
});
