import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import axios from 'axios'

const Dashboard = () => {
  const [portfolioData, setPortfolioData] = useState(null)
  const [marketData, setMarketData] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE = 'http://localhost:8000/api'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        // Initialize system if needed
        try {
          await axios.post(`${API_BASE}/initialize/`)
        } catch (initError) {
          console.log('System might already be initialized:', initError.message)
        }

        // Fetch portfolio data
        if (token) {
          const portfolioResponse = await axios.get(`${API_BASE}/portfolio/`, { headers })
          const portfolio = portfolioResponse.data.portfolio

          // Calculate portfolio metrics
          const wallets = portfolio.wallets || []
          const totalValue = portfolio.total_value_usd || 0
          
          // Find top gainer and loser
          let topGainer = { symbol: 'N/A', change: 0 }
          let topLoser = { symbol: 'N/A', change: 0 }
          
          wallets.forEach(wallet => {
            // Mock day change calculation (in real app, you'd track this)
            const dayChange = (Math.random() - 0.5) * 10 // Random change between -5% and +5%
            if (dayChange > topGainer.change) {
              topGainer = { symbol: wallet.symbol, change: dayChange }
            }
            if (dayChange < topLoser.change) {
              topLoser = { symbol: wallet.symbol, change: dayChange }
            }
          })

          setPortfolioData({
            totalValue: totalValue,
            dayChange: totalValue * 0.05, // Mock 5% daily change
            dayChangePercent: 5.0,
            topGainer,
            topLoser
          })

          // Fetch transaction history for recent activity
          const transactionsResponse = await axios.get(`${API_BASE}/transactions/`, { headers })
          const transactions = transactionsResponse.data.transactions || []
          
          const formattedActivity = transactions.slice(0, 5).map(tx => ({
            type: getActivityType(tx.transaction_type, tx.amount),
            symbol: tx.crypto_symbol,
            amount: Math.abs(tx.amount),
            price: 0, // Would need current price lookup
            value: 0, // Would calculate from amount * price
            timestamp: formatTimestamp(tx.created_at),
            status: tx.status === 'confirmed' ? 'completed' : tx.status
          }))

          setRecentActivity(formattedActivity)
        } else {
          // Default values for non-authenticated users
          setPortfolioData({
            totalValue: 0,
            dayChange: 0,
            dayChangePercent: 0,
            topGainer: { symbol: 'N/A', change: 0 },
            topLoser: { symbol: 'N/A', change: 0 }
          })
        }

        // Fetch market data
        const marketResponse = await axios.get(`${API_BASE}/market-data/`)
        const marketPairs = marketResponse.data.market_data || []
        
        const formattedMarketData = marketPairs.map(pair => ({
          symbol: pair.base_symbol,
          name: getCryptoName(pair.base_symbol),
          price: pair.current_price,
          change: pair.price_change_24h,
          volume: formatVolume(pair.volume_24h),
          marketCap: calculateMarketCap(pair.base_symbol, pair.current_price)
        }))

        setMarketData(formattedMarketData)
        setLoading(false)

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
        setLoading(false)
      }
    }

    fetchData()
    
    // Set up periodic refresh for market data
    const interval = setInterval(() => {
      fetchMarketData()
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const fetchMarketData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/market-data/`)
      const marketPairs = response.data.market_data || []
      
      const formattedMarketData = marketPairs.map(pair => ({
        symbol: pair.base_symbol,
        name: getCryptoName(pair.base_symbol),
        price: pair.current_price,
        change: pair.price_change_24h,
        volume: formatVolume(pair.volume_24h),
        marketCap: calculateMarketCap(pair.base_symbol, pair.current_price)
      }))

      setMarketData(formattedMarketData)
    } catch (err) {
      console.error('Error updating market data:', err)
    }
  }

  const getCryptoName = (symbol) => {
    const names = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'ARC': 'Arc Token',
      'USDT': 'Tether USD',
      'SOL': 'Solana',
      'BNB': 'Binance Coin',
      'ADA': 'Cardano',
      'DOT': 'Polkadot',
      'LINK': 'Chainlink'
    }
    return names[symbol] || symbol
  }

  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`
    }
    return volume.toFixed(0)
  }

  const calculateMarketCap = (symbol, price) => {
    // Mock market cap calculation (in real app, you'd have supply data)
    const mockSupplies = {
      'BTC': 19700000,
      'ETH': 120000000,
      'ARC': 100000000,
      'SOL': 460000000,
      'BNB': 153000000,
      'ADA': 35000000000,
      'DOT': 1100000000,
      'LINK': 530000000
    }
    
    const supply = mockSupplies[symbol] || 1000000
    const marketCap = price * supply
    
    if (marketCap >= 1000000000) {
      return `${(marketCap / 1000000000).toFixed(1)}B`
    } else if (marketCap >= 1000000) {
      return `${(marketCap / 1000000).toFixed(1)}M`
    }
    return `${marketCap.toFixed(0)}`
  }

  const getActivityType = (transactionType, amount) => {
    if (transactionType === 'trade') {
      return amount > 0 ? 'buy' : 'sell'
    }
    if (transactionType === 'transfer') {
      return amount > 0 ? 'receive' : 'send'
    }
    return transactionType
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) {
      return `${diffMins} minutes ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatPercentage = (percentage) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-950 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white text-lg">Loading dashboard...</span>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-950 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-400 text-lg mb-2">⚠️ {error}</div>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!portfolioData) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-6 border border-purple-500/20">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Arc Exchange</h1>
          <p className="text-gray-300">Your comprehensive crypto trading and portfolio management platform</p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm">Total Portfolio Value</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(portfolioData.totalValue)}</p>
            <p className={`text-sm ${portfolioData.dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolioData.dayChange >= 0 ? '+' : ''}{formatCurrency(portfolioData.dayChange)} ({formatPercentage(portfolioData.dayChangePercent)})
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm">Top Gainer</h3>
              <span className="text-2xl">🚀</span>
            </div>
            <p className="text-2xl font-bold text-white">{portfolioData.topGainer.symbol}</p>
            <p className="text-green-400 text-sm">{formatPercentage(portfolioData.topGainer.change)}</p>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm">Top Loser</h3>
              <span className="text-2xl">📉</span>
            </div>
            <p className="text-2xl font-bold text-white">{portfolioData.topLoser.symbol}</p>
            <p className="text-red-400 text-sm">{formatPercentage(portfolioData.topLoser.change)}</p>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm">Live Market Data</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-white">{marketData.length}</p>
            <p className="text-gray-400 text-sm">Trading pairs active</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Overview */}
          <div className="lg:col-span-2 bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-xl">Live Market Data</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Live</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="text-left text-gray-400 text-sm font-medium pb-3">Asset</th>
                    <th className="text-right text-gray-400 text-sm font-medium pb-3">Price</th>
                    <th className="text-right text-gray-400 text-sm font-medium pb-3">24h Change</th>
                    <th className="text-right text-gray-400 text-sm font-medium pb-3">Volume</th>
                    <th className="text-right text-gray-400 text-sm font-medium pb-3">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.map((asset) => (
                    <tr key={asset.symbol} className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{
                              backgroundColor: asset.symbol === 'BTC' ? '#f7931a' :
                                              asset.symbol === 'ETH' ? '#627eea' :
                                              asset.symbol === 'ARC' ? '#8b5cf6' :
                                              asset.symbol === 'BNB' ? '#f3ba2f' :
                                              asset.symbol === 'ADA' ? '#0033ad' : '#6b7280'
                            }}
                          >
                            {asset.symbol.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{asset.symbol}</p>
                            <p className="text-gray-400 text-sm">{asset.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-right text-white py-4">${asset.price.toFixed(8)}</td>
                      <td className={`text-right py-4 ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercentage(asset.change)}
                      </td>
                      <td className="text-right text-gray-300 py-4">{asset.volume}</td>
                      <td className="text-right text-gray-300 py-4">{asset.marketCap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
            <h3 className="text-white font-semibold text-xl mb-6">Recent Activity</h3>
            
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-black/30 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      activity.type === 'buy' ? 'bg-green-500/20 text-green-400' :
                      activity.type === 'sell' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {activity.type === 'buy' ? '📈' : activity.type === 'sell' ? '📉' : '📥'}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {activity.type === 'buy' ? 'Bought' : activity.type === 'sell' ? 'Sold' : 'Received'} {activity.symbol}
                      </p>
                      <p className="text-gray-400 text-xs">{activity.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">{activity.amount.toFixed(4)}</p>
                    <p className="text-gray-300 text-xs">{activity.status}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No recent activity</p>
                  <p className="text-sm">Start trading to see your transactions here</p>
                </div>
              )}
            </div>

            <button className="w-full mt-4 bg-purple-500/20 text-purple-300 py-2 rounded-xl hover:bg-purple-500/30 transition-colors">
              View All Activity
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => window.location.href = '/trading'}
            className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:bg-purple-500/10 transition-colors group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">💸</div>
            <h4 className="text-white font-medium">Quick Trade</h4>
            <p className="text-gray-400 text-sm">Buy/sell crypto instantly</p>
          </button>

          <button 
            onClick={() => window.location.href = '/portfolio'}
            className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:bg-purple-500/10 transition-colors group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">💼</div>
            <h4 className="text-white font-medium">Portfolio</h4>
            <p className="text-gray-400 text-sm">Manage your assets</p>
          </button>

          <button 
            onClick={() => window.location.href = '/wallet'}
            className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:bg-purple-500/10 transition-colors group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🔐</div>
            <h4 className="text-white font-medium">Wallet</h4>
            <p className="text-gray-400 text-sm">Multi-crypto storage</p>
          </button>

          <button 
            onClick={() => window.location.href = '/orders'}
            className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:bg-purple-500/10 transition-colors group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📋</div>
            <h4 className="text-white font-medium">Orders</h4>
            <p className="text-gray-400 text-sm">Track your trades</p>
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
