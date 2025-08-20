import { useEffect, useState } from 'react'

const OrderHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // Load orders from localStorage (from Cart purchases)
    const localOrders = JSON.parse(localStorage.getItem('curve_orders') || '[]')
    setOrders(localOrders)
    setLoading(false)
  }, [])

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'Arc Wallet': return '⚡'
      case 'Razorpay': return '💳'
      case 'Stripe': return '🔷'
      case 'PayPal': return '🅿️'
      default: return '💰'
    }
  }

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'Arc Wallet': return 'from-purple-500 to-blue-500'
      case 'Razorpay': return 'from-blue-500 to-indigo-500'
      case 'Stripe': return 'from-indigo-500 to-purple-500'
      case 'PayPal': return 'from-blue-400 to-blue-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.paymentMethod === filter
  })

  const paymentMethods = ['all', 'Arc Wallet', 'Razorpay', 'Stripe', 'PayPal']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">Track all your purchases and transactions</p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Payment Method</h3>
          <div className="flex flex-wrap gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method}
                onClick={() => setFilter(method)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  filter === method
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {method === 'all' ? '🔍 All Orders' : `${getPaymentMethodIcon(method)} ${method}`}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' ? 'You haven\'t made any purchases yet.' : `No orders found for ${filter}.`}
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-600 transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getPaymentMethodColor(order.paymentMethod)} flex items-center justify-center text-white text-xl`}>
                      {getPaymentMethodIcon(order.paymentMethod)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Order #{order.id.toString().slice(-8)}</h3>
                      <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-700">{order.total.toFixed(2)} ARC</div>
                      <div className="text-sm text-gray-500">≈ ${(order.total * 0.45).toFixed(2)} USD</div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-600 mb-3">Items Purchased:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-gray-800 font-medium">{item.name}</span>
                        <span className="text-gray-600 font-semibold">{item.price} ARC</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method Details */}
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-600">Payment Method:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getPaymentMethodIcon(order.paymentMethod)}</span>
                        <span className="font-semibold text-gray-800">{order.paymentMethod}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Transaction ID: {order.id.toString().slice(-12)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {orders.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Purchase Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-700">{orders.length}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Total Spent (ARC)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {orders.filter(order => order.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed Orders</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderHistory
