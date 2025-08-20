import { useState, useEffect } from "react"
import axios from "axios"

const SYMBOLS = ["ARC", "BTC", "ETH"]

const Dashboard = () => {
  const [wallet, setWallet] = useState(null)
  const [amount, setAmount] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [prices, setPrices] = useState({})
  const [orderType, setOrderType] = useState("buy")
  const [symbol, setSymbol] = useState("ARC")
  const [orderPrice, setOrderPrice] = useState(0)
  const [orderAmount, setOrderAmount] = useState(0)
  const [orderBook, setOrderBook] = useState([])

  const token = localStorage.getItem("token")

  const fetchWallet = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/wallet/", {
        headers: { Authorization: `Token ${token}` },
      })
      setWallet(res.data.wallet)
    } catch (err) {
      console.log("Error fetching wallet:", err)
      alert("Error fetching wallet")
    }
  }

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/transactions/", {
        headers: { Authorization: `Token ${token}` },
      })
      setTransactions(res.data.transactions)
    } catch (err) {
      // ignore
    }
  }

  const fetchPrices = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/trade/prices/")
      setPrices(res.data.prices)
    } catch (err) {}
  }

  const fetchOrderBook = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/trade/orderbook/?symbol=${symbol}`)
      setOrderBook(res.data.orders)
    } catch (err) {}
  }

  useEffect(() => {
    fetchWallet()
    fetchTransactions()
    fetchPrices()
    fetchOrderBook()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    fetchOrderBook()
    // eslint-disable-next-line
  }, [symbol])

  const handleBuy = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/buy/",
        { amount },
        { headers: { Authorization: `Token ${token}` } }
      )
      fetchWallet()
      fetchTransactions()
      setAmount(0)
    } catch (err) {
      alert("Buy failed")
    }
  }

  const handleSell = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/sell/",
        { amount },
        { headers: { Authorization: `Token ${token}` } }
      )
      fetchWallet()
      fetchTransactions()
      setAmount(0)
    } catch (err) {
      alert("Sell failed")
    }
  }

  const handlePlaceOrder = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/trade/order/",
        {
          type: orderType,
          symbol,
          price: orderPrice,
          amount: orderAmount,
        },
        { headers: { Authorization: `Token ${token}` } }
      )
      fetchOrderBook()
      setOrderPrice(0)
      setOrderAmount(0)
    } catch (err) {
      alert("Order failed")
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Arc Wallet Dashboard</h1>
      <button
        onClick={fetchWallet}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Refresh Wallet Info
      </button>

      {wallet && (
        <div className="bg-white mt-4 p-4 rounded shadow">
          <p><strong>Wallet Address:</strong> {wallet.public_key}</p>
          <p><strong>Network:</strong> {wallet.network}</p>
          <p><strong>Balance:</strong> {wallet.balance} ARC</p>
        </div>
      )}

      <div className="bg-white mt-4 p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Buy/Sell Crypto</h2>
        <input
          type="number"
          className="border p-2 mr-2"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          placeholder="Amount"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2" onClick={handleBuy}>Buy</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleSell}>Sell</button>
      </div>

      <div className="bg-white mt-4 p-4 rounded shadow mt-6">
        <h2 className="text-xl font-bold mb-2">Simulated Prices</h2>
        <ul className="flex gap-6">
          {SYMBOLS.map(sym => (
            <li key={sym} className="font-mono">
              {sym}: {prices[sym] || "-"} USD
            </li>
          ))}
        </ul>
        <button className="mt-2 bg-gray-300 px-2 py-1 rounded" onClick={fetchPrices}>Refresh Prices</button>
      </div>

      <div className="bg-white mt-4 p-4 rounded shadow mt-6">
        <h2 className="text-xl font-bold mb-2">Place Trade Order</h2>
        <select value={orderType} onChange={e => setOrderType(e.target.value)} className="border p-2 mr-2">
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <select value={symbol} onChange={e => setSymbol(e.target.value)} className="border p-2 mr-2">
          {SYMBOLS.map(sym => (
            <option key={sym} value={sym}>{sym}</option>
          ))}
        </select>
        <input
          type="number"
          className="border p-2 mr-2"
          value={orderPrice}
          onChange={e => setOrderPrice(Number(e.target.value))}
          placeholder="Price"
        />
        <input
          type="number"
          className="border p-2 mr-2"
          value={orderAmount}
          onChange={e => setOrderAmount(Number(e.target.value))}
          placeholder="Amount"
        />
        <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={handlePlaceOrder}>Place Order</button>
      </div>

      <div className="bg-white mt-4 p-4 rounded shadow mt-6">
        <h2 className="text-xl font-bold mb-2">Order Book ({symbol})</h2>
        <ul>
          {orderBook.map(order => (
            <li key={order.id} className="mb-2">
              <span className="font-mono">{order.type.toUpperCase()}</span> {order.amount} {order.symbol} @ {order.price} USD
              <span className="ml-2 text-xs text-gray-500">{new Date(order.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white mt-4 p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Transaction History</h2>
        <ul>
          {transactions.map(txn => (
            <li key={txn.id} className="mb-2">
              <span className="font-mono">{new Date(txn.timestamp).toLocaleString()}</span> -
              <span> {txn.amount} ARC to {txn.to_address} ({txn.status})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
