import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';
// Color palette for coins
const coinColors = {
  BTC: '#f7931a',
  ETH: '#627eea',
  ARC: '#8b5cf6',
  BNB: '#f3ba2f',
};
import Layout from '../components/Layout'

const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')
  const [showPnL, setShowPnL] = useState(true)
  const [performanceData, setPerformanceData] = useState([])
  const [coinLines, setCoinLines] = useState([])
  const [yDomain, setYDomain] = useState([-100, 100]);

  const mockPortfolio = {
    totalValue: 125420.50,
    totalPnL: 8520.30,
    totalPnLPercentage: 7.3,
    holdings: [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        balance: 2.5420,
        value: 109875.25,
        avgPrice: 41200.50,
        currentPrice: 43250.50,
        pnl: 5210.25,
        pnlPercentage: 4.98,
        allocation: 87.6
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 4.8750,
        value: 12922.50,
        avgPrice: 2580.50,
        currentPrice: 2650.80,
        pnl: 342.96,
        pnlPercentage: 2.72,
        allocation: 10.3
      },
      {
        symbol: 'ARC',
        name: 'Arc Token',
        balance: 100.0000,
        value: 12540.00,
        avgPrice: 118.20,
        currentPrice: 125.40,
        pnl: 720.00,
        pnlPercentage: 6.09,
        allocation: 10.0
      },
      {
        symbol: 'BNB',
        name: 'Binance Coin',
        balance: 15.2500,
        value: 4813.25,
        avgPrice: 320.50,
        currentPrice: 315.60,
        pnl: -74.75,
        pnlPercentage: -1.53,
        allocation: 3.8
      }
    ],
    recentTransactions: [
      {
        type: 'buy',
        symbol: 'BTC',
        amount: 0.1250,
        price: 43100.00,
        value: 5387.50,
        timestamp: '2024-01-15 14:30:22',
        status: 'completed'
      },
      {
        type: 'sell',
        symbol: 'ETH',
        amount: 1.5000,
        price: 2645.20,
        value: 3967.80,
        timestamp: '2024-01-15 12:15:45',
        status: 'completed'
      },
      {
        type: 'buy',
        symbol: 'ARC',
        amount: 50.0000,
        price: 124.80,
        value: 6240.00,
        timestamp: '2024-01-15 10:45:12',
        status: 'completed'
      }
    ]
  }

  useEffect(() => {
    setPortfolioData(mockPortfolio)
    // Generate mock performance data for total and each coin as P&L %
    let steps, interval;
    if (selectedTimeframe === '1y') {
      steps = 365;
      interval = 86400 * 1000;
    } else if (selectedTimeframe === '90d') {
      steps = 90;
      interval = 86400 * 1000;
    } else if (selectedTimeframe === '30d') {
      steps = 30;
      interval = 86400 * 1000;
    } else if (selectedTimeframe === '7d') {
      steps = 7;
      interval = 86400 * 1000;
    } else {
      steps = 24;
      interval = 3600 * 1000;
    }
    const now = Date.now();
    let points = [];
    // Generate realistic random data with spikes for 1 year
    let baseTotal = mockPortfolio.totalPnLPercentage;
    let baseCoins = {};
    mockPortfolio.holdings.forEach(h => { baseCoins[h.symbol] = h.pnlPercentage; });
    for (let i = steps - 1; i >= 0; i--) {
      let pt = { timestamp: new Date(now - i * interval).toLocaleDateString('en-US', steps > 90 ? { month: 'short', year: '2-digit' } : { month: 'short', day: 'numeric' }) };
      // Add random walk and spikes
      let spike = 0;
      if (steps >= 365 && (i === 300 || i === 180 || i === 60)) spike = (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 10);
      let totalPnL = baseTotal + (Math.random() - 0.5) * 2 + Math.sin(i / steps * Math.PI * 4) * 3 + spike;
      pt.total = totalPnL;
      mockPortfolio.holdings.forEach(h => {
        let coinSpike = 0;
        if (steps >= 365 && (i === 320 || i === 200 || i === 40) && h.symbol === 'BTC') coinSpike = 8 * (Math.random() > 0.5 ? 1 : -1);
        if (steps >= 365 && (i === 250 || i === 100) && h.symbol === 'ETH') coinSpike = 6 * (Math.random() > 0.5 ? 1 : -1);
        let fluct = (Math.random() - 0.5) * 2 + Math.sin(i / steps * Math.PI * 4 + h.symbol.length) * 2 + coinSpike;
        pt[h.symbol] = baseCoins[h.symbol] + fluct;
      });
      points.push(pt);
    }
    setPerformanceData(points);
    setCoinLines(mockPortfolio.holdings.map(h => h.symbol));
    // Calculate min/max for all lines
    let min = 100, max = -100;
    points.forEach(pt => {
      min = Math.min(min, pt.total);
      max = Math.max(max, pt.total);
      mockPortfolio.holdings.forEach(h => {
        min = Math.min(min, pt[h.symbol]);
        max = Math.max(max, pt[h.symbol]);
      });
    });
    min = Math.floor(min - 5);
    max = Math.ceil(max + 5);
    setYDomain([min, max]);
  }, [selectedTimeframe])

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

  if (!portfolioData) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading portfolio...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Portfolio Summary */}
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
            <p className="text-3xl font-bold text-white">{formatCurrency(portfolioData.totalValue)}</p>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:border-green-400/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Total P&L</h3>
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className={`text-3xl font-bold font-mono ${portfolioData.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolioData.totalPnL >= 0 ? '+' : ''}{formatCurrency(portfolioData.totalPnL)}
            </p>
            <p className={`text-sm font-mono ${portfolioData.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatPercentage(portfolioData.totalPnLPercentage)}
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm">Best Performer</h3>
              <div className="w-8 h-8 rounded-lg bg-yellow-400/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8M12 17v4M7 7h10l-1 7H8L7 7z" />
                  <circle cx="12" cy="5" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </div>
            <p className="text-xl font-bold text-white">ARC</p>
            <p className="text-green-400 text-sm">+6.09%</p>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm">Total Assets</h3>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <ellipse cx="12" cy="8" rx="7" ry="3" stroke="currentColor" strokeWidth="2" fill="none" />
                  <ellipse cx="12" cy="12" rx="7" ry="3" stroke="currentColor" strokeWidth="2" fill="none" />
                  <ellipse cx="12" cy="16" rx="7" ry="3" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{portfolioData.holdings.length}</p>
            <p className="text-gray-400 text-sm">Different coins</p>
          </div>
        </div>

        {/* Portfolio Chart & Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Performance Chart */}
          <div className="lg:col-span-2 bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-xl">Portfolio Performance</h3>
              <div className="flex space-x-2">
                {['24h', '7d', '30d', '90d', '1y'].map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      selectedTimeframe === timeframe
                        ? 'bg-purple-500 text-white'
                        : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>

            {/* Futuristic Multi-Line Portfolio Performance Chart (P&L %) with Dynamic Zoom */}
            <div className="h-64 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-xl border border-purple-500/10 shadow-2xl relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#8b5cf6" opacity={0.1}/>
                  <XAxis dataKey="timestamp" tick={{ fill: '#a5b4fc', fontSize: 12 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill: '#a5b4fc', fontSize: 12 }} axisLine={false} tickLine={false} domain={yDomain} unit="%"/>
                  <Tooltip contentStyle={{ background: '#1e1b4b', border: '1px solid #8b5cf6', color: '#fff', borderRadius: 12 }} labelStyle={{ color: '#8b5cf6' }} formatter={(value, name) => [`${value.toFixed(2)}%`, name === 'total' ? 'Total P&L' : `${name} P&L`]}/>
                  {/* Main line: total portfolio P&L % */}
                  <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={4} dot={false} isAnimationActive={true} name="Total P&L" />
                  {/* Lines for each coin P&L % */}
                  {coinLines.map(sym => (
                    <Line key={sym} type="monotone" dataKey={sym} stroke={coinColors[sym] || '#fff'} strokeWidth={2} dot={false} isAnimationActive={true} name={`${sym} P&L`} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <div className="absolute top-4 left-4 text-white text-lg font-bold drop-shadow-lg">Portfolio P&L (%)</div>
              <div className="absolute bottom-4 right-4 text-purple-400 text-xs font-mono bg-black/30 px-3 py-1 rounded-xl shadow-lg">Futuristic Performance</div>
            </div>
          </div>

          {/* Asset Allocation - Futuristic Pie Chart */}
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
            <h3 className="text-white font-semibold text-xl mb-6">Asset Allocation</h3>
            <div className="h-48 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl flex items-center justify-center border border-purple-500/10 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData.holdings}
                    dataKey="allocation"
                    nameKey="symbol"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}
                    label={({ symbol, allocation }) => `${symbol}: ${allocation}%`}
                    isAnimationActive={true}
                  >
                    {portfolioData.holdings.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={coinColors[entry.symbol] || '#8884d8'} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {portfolioData.holdings.map((holding) => (
                <div key={holding.symbol} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: coinColors[holding.symbol] || '#6b7280'
                      }}
                    ></div>
                    <span className="text-white text-sm font-medium">{holding.symbol}</span>
                  </div>
                  <span className="text-gray-300 text-sm">{holding.allocation}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold text-xl">Holdings</h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showPnL}
                  onChange={(e) => setShowPnL(e.target.checked)}
                  className="rounded border-gray-600 bg-black/30 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-gray-300 text-sm">Show P&L</span>
              </label>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">Asset</th>
                  <th className="text-right text-gray-400 text-sm font-medium pb-3">Balance</th>
                  <th className="text-right text-gray-400 text-sm font-medium pb-3">Price</th>
                  <th className="text-right text-gray-400 text-sm font-medium pb-3">Value</th>
                  {showPnL && (
                    <>
                      <th className="text-right text-gray-400 text-sm font-medium pb-3">Avg Price</th>
                      <th className="text-right text-gray-400 text-sm font-medium pb-3">P&L</th>
                    </>
                  )}
                  <th className="text-right text-gray-400 text-sm font-medium pb-3">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.holdings.map((holding) => (
                  <tr key={holding.symbol} className="border-b border-purple-500/10">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{
                            backgroundColor: holding.symbol === 'BTC' ? '#f7931a' :
                                            holding.symbol === 'ETH' ? '#627eea' :
                                            holding.symbol === 'ARC' ? '#8b5cf6' :
                                            holding.symbol === 'BNB' ? '#f3ba2f' : '#6b7280'
                          }}
                        >
                          {holding.symbol.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{holding.symbol}</p>
                          <p className="text-gray-400 text-sm">{holding.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right text-white py-4 font-mono">{holding.balance.toFixed(4)}</td>
                    <td className="text-right text-white py-4 font-mono">{formatCurrency(holding.currentPrice)}</td>
                    <td className="text-right text-white py-4 font-mono">{formatCurrency(holding.value)}</td>
                    {showPnL && (
                      <>
                        <td className="text-right text-gray-300 py-4 font-mono">{formatCurrency(holding.avgPrice)}</td>
                        <td className={`text-right py-4 font-mono ${holding.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <div>
                            <p>{holding.pnl >= 0 ? '+' : ''}{formatCurrency(holding.pnl)}</p>
                            <p className="text-sm">{formatPercentage(holding.pnlPercentage)}</p>
                          </div>
                        </td>
                      </>
                    )}
                    <td className="text-right text-white py-4">{holding.allocation}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
          <h3 className="text-white font-semibold text-xl mb-6">Recent Transactions</h3>
          
          <div className="space-y-4">
            {portfolioData.recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {transaction.type === 'buy' ? '📈' : '📉'}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {transaction.type === 'buy' ? 'Bought' : 'Sold'} {transaction.symbol}
                    </p>
                    <p className="text-gray-400 text-sm">{transaction.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{transaction.amount} {transaction.symbol}</p>
                  <p className="text-gray-300 text-sm">{formatCurrency(transaction.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Portfolio
