import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import axios from 'axios'

const Dashboard = () => {
  const [portfolioData, setPortfolioData] = useState(null)
  const [marketData, setMarketData] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        console.log('Dashboard: Starting data fetch...')
        console.log('Dashboard: Token present:', !!token)

        // Initialize system if needed
        try {
          await axios.post(`${API_BASE}/initialize/`)
          console.log('Dashboard: System initialized')
        } catch (initError) {
          console.log('Dashboard: System might already be initialized:', initError.message)
        }

        // Fetch portfolio data
        if (token) {
          console.log('Dashboard: Fetching portfolio data...')
          try {
            const portfolioResponse = await axios.get(`${API_BASE}/portfolio/`, { headers })
            console.log('Dashboard: Portfolio response:', portfolioResponse.data)
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
            console.log('Dashboard: Fetching transactions...')
            try {
              const transactionsResponse = await axios.get(`${API_BASE}/transactions/`, { headers })
              console.log('Dashboard: Transactions response:', transactionsResponse.data)
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
            } catch (txError) {
              console.error('Dashboard: Error fetching transactions:', txError)
              setRecentActivity([])
            }
          } catch (portfolioError) {
            console.error('Dashboard: Error fetching portfolio:', portfolioError)
            if (portfolioError.response?.status === 401) {
              // Token might be invalid, redirect to login
              localStorage.removeItem('token')
              window.location.href = '/login'
              return
            }
            throw portfolioError
          }
        } else {
          console.log('Dashboard: No token found, using default values')
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
        console.log('Dashboard: Fetching market data...')
        try {
          const marketResponse = await axios.get(`${API_BASE}/market-data/`)
          console.log('Dashboard: Market data response:', marketResponse.data)
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
          console.log('Dashboard: Market data set successfully')
        } catch (marketError) {
          console.error('Dashboard: Error fetching market data:', marketError)
          setMarketData([])
        }
        
        setLoading(false)
        console.log('Dashboard: Data fetch completed')

      } catch (err) {
        console.error('Dashboard: Error fetching dashboard data:', err)
        setError(`Failed to load dashboard data: ${err.message}`)
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
      console.log('Dashboard: Updating market data...')
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
      console.log('Dashboard: Market data updated successfully')
    } catch (err) {
      console.error('Dashboard: Error updating market data:', err)
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
        <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-purple-500/20 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Arc Exchange
              </h1>
              <p className="text-gray-300 text-lg">Your comprehensive crypto trading and portfolio management platform</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:border-purple-400/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Total Portfolio Value</h3>
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1 font-mono">{formatCurrency(portfolioData.totalValue)}</p>
            <p className={`text-sm font-medium font-mono ${portfolioData.dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolioData.dayChange >= 0 ? '+' : ''}{formatCurrency(portfolioData.dayChange)} ({formatPercentage(portfolioData.dayChangePercent)})
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:border-green-400/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Top Gainer</h3>
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1 font-mono">{portfolioData.topGainer.symbol}</p>
            <p className="text-green-400 text-sm font-medium font-mono">+{formatPercentage(Math.abs(portfolioData.topGainer.change))}</p>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:border-red-400/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Top Loser</h3>
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{portfolioData.topLoser.symbol}</p>
            <p className="text-red-400 text-sm font-medium">{formatPercentage(portfolioData.topLoser.change)}</p>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:border-blue-400/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Live Market Data</h3>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{marketData.length}</p>
            <p className="text-gray-400 text-sm font-medium">Trading pairs active</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Overview */}
          <div className="lg:col-span-2 bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:border-purple-400/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-xl">Live Market Data</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Live</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="text-left text-gray-300 text-sm font-semibold pb-4">Asset</th>
                    <th className="text-right text-gray-300 text-sm font-semibold pb-4">Price</th>
                    <th className="text-right text-gray-300 text-sm font-semibold pb-4">24h Change</th>
                    <th className="text-right text-gray-300 text-sm font-semibold pb-4">Volume</th>
                    <th className="text-right text-gray-300 text-sm font-semibold pb-4">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.map((asset) => (
                    <tr key={asset.symbol} className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-all duration-200 group">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold border border-white/10 group-hover:border-white/20 transition-colors"
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
                      <td className="text-right text-white py-4 font-mono">${asset.price.toFixed(8)}</td>
                      <td className={`text-right py-4 font-mono ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercentage(asset.change)}
                      </td>
                      <td className="text-right text-gray-300 py-4 font-mono">{asset.volume}</td>
                      <td className="text-right text-gray-300 py-4 font-mono">{asset.marketCap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:border-purple-400/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-xl">Recent Activity</h3>
              <div className="text-xs text-gray-400 bg-purple-500/10 px-2 py-1 rounded-lg">
                Last 24h
              </div>
            </div>
            
            <div className="space-y-3">
              {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-purple-500/10 hover:border-purple-500/20 transition-all duration-200 group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'buy' ? 'bg-green-500/20 border border-green-500/30' :
                      activity.type === 'sell' ? 'bg-red-500/20 border border-red-500/30' :
                      'bg-blue-500/20 border border-blue-500/30'
                    }`}>
                      {activity.type === 'buy' ? (
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                      ) : activity.type === 'sell' ? (
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                      )}
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
                <div className="text-center py-12 text-gray-400">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="font-medium mb-1">No recent activity</p>
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
            className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:bg-purple-500/10 hover:border-purple-400/40 transition-all duration-300 group"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h4 className="text-white font-medium mb-1">Quick Trade</h4>
            <p className="text-gray-400 text-sm">Buy/sell crypto instantly</p>
          </button>

          <button 
            onClick={() => window.location.href = '/portfolio'}
            className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:bg-purple-500/10 hover:border-purple-400/40 transition-all duration-300 group"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h4 className="text-white font-medium mb-1">Portfolio</h4>
            <p className="text-gray-400 text-sm">Manage your assets</p>
          </button>

          <button 
            onClick={() => window.location.href = '/wallet'}
            className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:bg-purple-500/10 hover:border-purple-400/40 transition-all duration-300 group"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="text-white font-medium mb-1">Wallet</h4>
            <p className="text-gray-400 text-sm">Multi-crypto storage</p>
          </button>

          <button 
            onClick={() => window.location.href = '/orders'}
            className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:bg-purple-500/10 hover:border-purple-400/40 transition-all duration-300 group"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h4 className="text-white font-medium mb-1">Orders</h4>
            <p className="text-gray-400 text-sm">Track your trades</p>
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
