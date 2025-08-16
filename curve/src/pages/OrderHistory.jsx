import { useEffect, useState } from 'react'

const OrderHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      setError('')
      try {
        // For demo, use Arc token if available
        const token = localStorage.getItem('token')
        const res = await fetch('http://localhost:8000/api/transactions/', {
          headers: token ? { 'Authorization': `Token ${token}` } : {}
        })
        const data = await res.json()
        setOrders(data.transactions || [])
      } catch (e) {
        setError('Failed to fetch order history.')
      }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Order History</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <ul className="divide-y divide-gray-200">
        {orders.length === 0 && !loading && <li className="text-gray-500">No orders found.</li>}
        {orders.map((order, idx) => (
          <li key={idx} className="py-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-gray-500">{new Date(order.timestamp).toLocaleString()}</span>
              <span className={`text-sm font-semibold ${order.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{order.status}</span>
            </div>
            <div className="mt-1">
              <span className="font-medium">Amount:</span> {order.amount} ARC<br/>
              <span className="font-medium">To:</span> {order.to_address}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default OrderHistory
