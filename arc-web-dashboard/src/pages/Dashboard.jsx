import { useState } from "react"
import axios from "axios"

const Dashboard = () => {
  const [wallet, setWallet] = useState(null)

  const fetchWallet = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/get-wallet/1/") // Replace with logged-in user ID
      setWallet(res.data)
    } catch (err) {
      alert("Error fetching wallet")
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Arc Wallet Dashboard</h1>
      <button
        onClick={fetchWallet}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Get Wallet Info
      </button>

      {wallet && (
        <div className="bg-white mt-4 p-4 rounded shadow">
          <p><strong>Wallet Address:</strong> {wallet.wallet_address}</p>
          <p><strong>Network:</strong> {wallet.network}</p>
          <p><strong>Balance:</strong> {wallet.balance} MATIC</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard
