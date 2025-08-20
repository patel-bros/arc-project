import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

const Merchant = () => {
  const [merchantData, setMerchantData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const [showApiModal, setShowApiModal] = useState(false)

  const mockMerchantData = {
    businessName: 'Curve Store',
    merchantId: 'MERCH-001',
    status: 'active',
    totalVolume: 125420.50,
    totalTransactions: 1247,
    averageTransaction: 100.58,
    successRate: 98.5,
    apiKeys: [
      {
        id: 'api_1',
        name: 'Main Store API',
        key: 'pk_live_••••••••••••••••••••••••••••••••',
        created: '2024-01-10',
        lastUsed: '2024-01-15 14:30:22',
        status: 'active'
      }
    ],
    webhooks: [
      {
        id: 'wh_1',
        url: 'https://curve-store.com/webhooks/payment',
        events: ['payment.success', 'payment.failed'],
        status: 'active'
      }
    ]
  }

  const mockTransactions = [
    {
      id: 'TXN-001',
      orderId: 'ORD-2024-001',
      amount: 125.50,
      currency: 'BTC',
      usdValue: 5425.75,
      customer: 'john.doe@example.com',
      status: 'completed',
      timestamp: '2024-01-15 14:30:22',
      fees: 5.43
    },
    {
      id: 'TXN-002',
      orderId: 'ORD-2024-002',
      amount: 2.5000,
      currency: 'ETH',
      usdValue: 6627.00,
      customer: 'jane.smith@example.com',
      status: 'completed',
      timestamp: '2024-01-15 13:45:18',
      fees: 6.63
    },
    {
      id: 'TXN-003',
      orderId: 'ORD-2024-003',
      amount: 1000.00,
      currency: 'USDT',
      usdValue: 1000.00,
      customer: 'mike.wilson@example.com',
      status: 'pending',
      timestamp: '2024-01-15 12:20:45',
      fees: 1.00
    }
  ]

  useEffect(() => {
    setMerchantData(mockMerchantData)
    setTransactions(mockTransactions)
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
      case 'completed': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      case 'active': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      completed: 'bg-green-500/20 text-green-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      failed: 'bg-red-500/20 text-red-400',
      active: 'bg-green-500/20 text-green-400'
    }
    
    return colors[status] || 'bg-gray-500/20 text-gray-400'
  }

  const generateApiKey = () => {
    const newKey = {
      id: `api_${Date.now()}`,
      name: 'New API Key',
      key: `pk_live_${Math.random().toString(36).substr(2, 32)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'active'
    }
    
    setMerchantData(prev => ({
      ...prev,
      apiKeys: [...prev.apiKeys, newKey]
    }))
    setShowApiModal(false)
  }

  if (!merchantData) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading merchant data...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mr-4 border border-purple-500/30">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              Merchant Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Business Name: {merchantData.businessName}</p>
            <p className="text-gray-400">Merchant ID: {merchantData.merchantId}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(merchantData.status)}`}>
              {merchantData.status.toUpperCase()}
            </span>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-black/30 border border-gray-600 rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Merchant Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:border-green-400/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Total Volume</h3>
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(merchantData.totalVolume)}</p>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:border-blue-400/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Total Transactions</h3>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{merchantData.totalTransactions.toLocaleString()}</p>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:border-purple-400/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Average Transaction</h3>
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(merchantData.averageTransaction)}</p>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:border-green-400/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Success Rate</h3>
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-green-400">{merchantData.successRate}%</p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
          <h3 className="text-white font-semibold text-xl mb-6">Revenue Overview</h3>
          
          {/* Placeholder for chart */}
          <div className="h-64 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl flex items-center justify-center border border-purple-500/10">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-400 font-medium">Revenue Chart</p>
              <p className="text-gray-500 text-sm mt-2">Interactive chart showing revenue over time</p>
            </div>
          </div>
        </div>

        {/* API Management & Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Keys */}
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-xl">API Keys</h3>
              <button
                onClick={() => setShowApiModal(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-colors"
              >
                Generate Key
              </button>
            </div>

            <div className="space-y-4">
              {merchantData.apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="bg-black/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">{apiKey.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(apiKey.status)}`}>
                      {apiKey.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">API Key</label>
                      <div className="flex items-center space-x-2">
                        <code className="text-white bg-black/50 px-3 py-2 rounded text-sm flex-1 font-mono">
                          {apiKey.key}
                        </code>
                        <button className="text-purple-400 hover:text-purple-300 p-1 rounded-lg hover:bg-purple-500/20 transition-all duration-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                      <div>Created: {apiKey.created}</div>
                      <div>Last Used: {apiKey.lastUsed}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Webhooks */}
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-xl">Webhooks</h3>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-colors">
                Add Webhook
              </button>
            </div>

            <div className="space-y-4">
              {merchantData.webhooks.map((webhook) => (
                <div key={webhook.id} className="bg-black/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">Payment Webhook</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(webhook.status)}`}>
                      {webhook.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">URL</label>
                      <code className="text-white bg-black/50 px-3 py-2 rounded text-xs block font-mono">
                        {webhook.url}
                      </code>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Events</label>
                      <div className="flex space-x-2">
                        {webhook.events.map((event, idx) => (
                          <span key={idx} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
          <h3 className="text-white font-semibold text-xl mb-6">Recent Transactions</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">Transaction ID</th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">Order ID</th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">Customer</th>
                  <th className="text-right text-gray-400 text-sm font-medium pb-3">Amount</th>
                  <th className="text-right text-gray-400 text-sm font-medium pb-3">USD Value</th>
                  <th className="text-right text-gray-400 text-sm font-medium pb-3">Fees</th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">Status</th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-purple-500/10">
                    <td className="py-4">
                      <code className="text-white text-sm">{transaction.id}</code>
                    </td>
                    <td className="py-4">
                      <code className="text-gray-300 text-sm">{transaction.orderId}</code>
                    </td>
                    <td className="py-4 text-gray-300">{transaction.customer}</td>
                    <td className="text-right py-4 text-white">
                      {transaction.amount} {transaction.currency}
                    </td>
                    <td className="text-right py-4 text-white">{formatCurrency(transaction.usdValue)}</td>
                    <td className="text-right py-4 text-gray-300">{formatCurrency(transaction.fees)}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(transaction.status)}`}>
                        {transaction.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-gray-300 text-sm">{transaction.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Integration Guide */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
          <h3 className="text-white font-semibold text-xl mb-6">Integration Guide</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/30 rounded-xl p-4 hover:bg-black/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-white font-medium mb-2">Documentation</h4>
              <p className="text-gray-400 text-sm mb-4">Complete API documentation and integration guides</p>
              <button className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl hover:bg-blue-500/30 transition-colors w-full">
                View Docs
              </button>
            </div>

            <div className="bg-black/30 rounded-xl p-4 hover:bg-black/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h4 className="text-white font-medium mb-2">Code Examples</h4>
              <p className="text-gray-400 text-sm mb-4">Ready-to-use code snippets for popular languages</p>
              <button className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl hover:bg-green-500/30 transition-colors w-full">
                View Examples
              </button>
            </div>

            <div className="bg-black/30 rounded-xl p-4 hover:bg-black/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="text-white font-medium mb-2">Testing Tools</h4>
              <p className="text-gray-400 text-sm mb-4">Sandbox environment and testing utilities</p>
              <button className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-xl hover:bg-purple-500/30 transition-colors w-full">
                Test API
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generate API Key Modal */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 w-full max-w-md">
            <h3 className="text-white font-semibold text-xl mb-6">Generate New API Key</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Key Name</label>
                <input
                  type="text"
                  placeholder="Enter a name for this API key"
                  className="w-full bg-black/30 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-2">Permissions</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-black/30 text-purple-500 focus:ring-purple-500" />
                    <span className="text-gray-300 text-sm">Read transactions</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-black/30 text-purple-500 focus:ring-purple-500" />
                    <span className="text-gray-300 text-sm">Create payments</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-600 bg-black/30 text-purple-500 focus:ring-purple-500" />
                    <span className="text-gray-300 text-sm">Manage webhooks</span>
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowApiModal(false)}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={generateApiKey}
                  className="flex-1 bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600 transition-colors"
                >
                  Generate Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Merchant
