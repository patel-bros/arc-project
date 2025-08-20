import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [orderHistory, setOrderHistory] = useState([])
  const [activeTab, setActiveTab] = useState('open')
  const [filterPair, setFilterPair] = useState('all')

  const mockOpenOrders = [
    {
      id: 'ORD-001',
      pair: 'BTCUSDT',
      type: 'limit',
      side: 'buy',
      amount: 0.5000,
      price: 42800.00,
      filled: 0.1250,
      remaining: 0.3750,
      status: 'partially_filled',
      timestamp: '2024-01-15 14:30:22',
      total: 21400.00
    },
    {
      id: 'ORD-002',
      pair: 'ETHUSDT',
      type: 'limit',
      side: 'sell',
      amount: 2.0000,
      price: 2680.50,
      filled: 0.0000,
      remaining: 2.0000,
      status: 'open',
      timestamp: '2024-01-15 13:45:18',
      total: 5361.00
    },
    {
      id: 'ORD-003',
      pair: 'ARCUSDT',
      type: 'limit',
      side: 'buy',
      amount: 100.0000,
      price: 124.00,
      filled: 0.0000,
      remaining: 100.0000,
      status: 'open',
      timestamp: '2024-01-15 12:20:45',
      total: 12400.00
    }
  ]

  const mockOrderHistory = [
    {
      id: 'ORD-H001',
      pair: 'BTCUSDT',
      type: 'market',
      side: 'buy',
      amount: 0.2500,
      price: 43250.50,
      filled: 0.2500,
      remaining: 0.0000,
      status: 'filled',
      timestamp: '2024-01-15 11:30:22',
      total: 10812.63,
      fee: 10.81
    },
    {
      id: 'ORD-H002',
      pair: 'ETHUSDT',
      type: 'limit',
      side: 'sell',
      amount: 1.5000,
      price: 2645.20,
      filled: 1.5000,
      remaining: 0.0000,
      status: 'filled',
      timestamp: '2024-01-15 10:15:45',
      total: 3967.80,
      fee: 3.97
    },
    {
      id: 'ORD-H003',
      pair: 'BNBUSDT',
      type: 'limit',
      side: 'buy',
      amount: 5.0000,
      price: 320.00,
      filled: 0.0000,
      remaining: 5.0000,
      status: 'cancelled',
      timestamp: '2024-01-15 09:45:12',
      total: 1600.00,
      fee: 0.00
    },
    {
      id: 'ORD-H004',
      pair: 'ARCUSDT',
      type: 'market',
      side: 'buy',
      amount: 50.0000,
      price: 124.80,
      filled: 50.0000,
      remaining: 0.0000,
      status: 'filled',
      timestamp: '2024-01-14 16:20:30',
      total: 6240.00,
      fee: 6.24
    }
  ]

  const tradingPairs = ['all', 'BTCUSDT', 'ETHUSDT', 'ARCUSDT', 'BNBUSDT', 'ADAUSDT']

  useEffect(() => {
    setOrders(mockOpenOrders)
    setOrderHistory(mockOrderHistory)
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-blue-400'
      case 'partially_filled': return 'text-yellow-400'
      case 'filled': return 'text-green-400'
      case 'cancelled': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      open: 'bg-blue-500/20 text-blue-400',
      partially_filled: 'bg-yellow-500/20 text-yellow-400',
      filled: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400'
    }
    
    return colors[status] || 'bg-gray-500/20 text-gray-400'
  }

  const cancelOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId))
  }

  const filteredOrders = filterPair === 'all' 
    ? orders 
    : orders.filter(order => order.pair === filterPair)

  const filteredHistory = filterPair === 'all' 
    ? orderHistory 
    : orderHistory.filter(order => order.pair === filterPair)

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <span className="text-4xl mr-3">📋</span>
            Orders
          </h1>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterPair}
              onChange={(e) => setFilterPair(e.target.value)}
              className="bg-black/30 border border-gray-600 rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
            >
              {tradingPairs.map((pair) => (
                <option key={pair} value={pair}>
                  {pair === 'all' ? 'All Pairs' : pair}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm">Open Orders</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-white">{orders.length}</p>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm">Partially Filled</h3>
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-3xl font-bold text-yellow-400">
              {orders.filter(o => o.status === 'partially_filled').length}
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm">Total Volume</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm">Today's Orders</h3>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-3xl font-bold text-green-400">
              {orderHistory.filter(o => o.timestamp.includes('2024-01-15')).length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('open')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'open'
                ? 'bg-purple-500 text-white'
                : 'bg-black/20 text-gray-400 hover:bg-purple-500/20 hover:text-purple-300'
            }`}
          >
            Open Orders ({filteredOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-purple-500 text-white'
                : 'bg-black/20 text-gray-400 hover:bg-purple-500/20 hover:text-purple-300'
            }`}
          >
            Order History ({filteredHistory.length})
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
          {activeTab === 'open' ? (
            <div>
              <h3 className="text-white font-semibold text-xl mb-6">Open Orders</h3>
              
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-400 text-lg">No open orders</p>
                  <p className="text-gray-500 text-sm mt-2">Your active orders will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-purple-500/20">
                        <th className="text-left text-gray-400 text-sm font-medium pb-3">Pair</th>
                        <th className="text-left text-gray-400 text-sm font-medium pb-3">Type</th>
                        <th className="text-left text-gray-400 text-sm font-medium pb-3">Side</th>
                        <th className="text-right text-gray-400 text-sm font-medium pb-3">Amount</th>
                        <th className="text-right text-gray-400 text-sm font-medium pb-3">Price</th>
                        <th className="text-right text-gray-400 text-sm font-medium pb-3">Filled</th>
                        <th className="text-right text-gray-400 text-sm font-medium pb-3">Total</th>
                        <th className="text-left text-gray-400 text-sm font-medium pb-3">Status</th>
                        <th className="text-left text-gray-400 text-sm font-medium pb-3">Time</th>
                        <th className="text-center text-gray-400 text-sm font-medium pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-purple-500/10">
                          <td className="py-4">
                            <span className="text-white font-medium">{order.pair}</span>
                          </td>
                          <td className="py-4">
                            <span className="text-gray-300 capitalize">{order.type}</span>
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              order.side === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {order.side.toUpperCase()}
                            </span>
                          </td>
                          <td className="text-right py-4 text-white">{order.amount.toFixed(4)}</td>
                          <td className="text-right py-4 text-white">{formatCurrency(order.price)}</td>
                          <td className="text-right py-4">
                            <div>
                              <span className="text-white">{order.filled.toFixed(4)}</span>
                              <span className="text-gray-400 text-sm block">
                                {((order.filled / order.amount) * 100).toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="text-right py-4 text-white">{formatCurrency(order.total)}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(order.status)}`}>
                              {order.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 text-gray-300 text-sm">{order.timestamp}</td>
                          <td className="text-center py-4">
                            <button
                              onClick={() => cancelOrder(order.id)}
                              className="bg-red-500/20 text-red-400 px-3 py-1 rounded text-xs hover:bg-red-500/30 transition-colors"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-white font-semibold text-xl mb-6">Order History</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-500/20">
                      <th className="text-left text-gray-400 text-sm font-medium pb-3">Pair</th>
                      <th className="text-left text-gray-400 text-sm font-medium pb-3">Type</th>
                      <th className="text-left text-gray-400 text-sm font-medium pb-3">Side</th>
                      <th className="text-right text-gray-400 text-sm font-medium pb-3">Amount</th>
                      <th className="text-right text-gray-400 text-sm font-medium pb-3">Price</th>
                      <th className="text-right text-gray-400 text-sm font-medium pb-3">Total</th>
                      <th className="text-right text-gray-400 text-sm font-medium pb-3">Fee</th>
                      <th className="text-left text-gray-400 text-sm font-medium pb-3">Status</th>
                      <th className="text-left text-gray-400 text-sm font-medium pb-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((order) => (
                      <tr key={order.id} className="border-b border-purple-500/10">
                        <td className="py-4">
                          <span className="text-white font-medium">{order.pair}</span>
                        </td>
                        <td className="py-4">
                          <span className="text-gray-300 capitalize">{order.type}</span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            order.side === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {order.side.toUpperCase()}
                          </span>
                        </td>
                        <td className="text-right py-4 text-white">{order.amount.toFixed(4)}</td>
                        <td className="text-right py-4 text-white">{formatCurrency(order.price)}</td>
                        <td className="text-right py-4 text-white">{formatCurrency(order.total)}</td>
                        <td className="text-right py-4 text-gray-300">{formatCurrency(order.fee)}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(order.status)}`}>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 text-gray-300 text-sm">{order.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Orders
