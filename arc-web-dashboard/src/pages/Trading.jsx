import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axios from 'axios';
import Layout from '../components/Layout'

const Trading = () => {
  const [selectedPair, setSelectedPair] = useState('BTCUSDT')
  const [orderType, setOrderType] = useState('limit')
  const [orderSide, setOrderSide] = useState('buy')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] })
  const [recentTrades, setRecentTrades] = useState([])
  const [priceHistory, setPriceHistory] = useState([])
  const [loadingChart, setLoadingChart] = useState(false)
  const [btcPrice, setBtcPrice] = useState(null)
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
  
  const [tradingPairs, setTradingPairs] = useState([
    { pair: 'BTCUSDT', price: 43250.50, change: '+2.45%', volume: '1.2M' },
    { pair: 'ETHUSDT', price: 2650.80, change: '+1.85%', volume: '850K' },
    { pair: 'ARCUSDT', price: 125.40, change: '+5.20%', volume: '500K' },
    { pair: 'BNBUSDT', price: 315.60, change: '-0.75%', volume: '320K' },
    { pair: 'ADAUSDT', price: 0.485, change: '+3.15%', volume: '180K' },
  ])

  const mockOrderBook = {
    bids: [
      { price: 43245.50, quantity: 0.5420, total: 23425.50 },
      { price: 43240.25, quantity: 1.2150, total: 52532.50 },
      { price: 43235.80, quantity: 0.8750, total: 37831.25 },
      { price: 43230.15, quantity: 2.1500, total: 92944.82 },
      { price: 43225.90, quantity: 0.6200, total: 26800.06 },
    ],
    asks: [
      { price: 43255.75, quantity: 0.7500, total: 32441.81 },
      { price: 43260.20, quantity: 1.1200, total: 48451.42 },
      { price: 43265.85, quantity: 0.4850, total: 20983.94 },
      { price: 43270.40, quantity: 1.8750, total: 81131.25 },
      { price: 43275.95, quantity: 0.9100, total: 39381.15 },
    ]
  }

  const mockTrades = [
    { price: 43250.50, quantity: 0.1250, time: '14:35:42', side: 'buy' },
    { price: 43248.20, quantity: 0.0850, time: '14:35:38', side: 'sell' },
    { price: 43252.10, quantity: 0.2100, time: '14:35:35', side: 'buy' },
    { price: 43245.75, quantity: 0.1580, time: '14:35:31', side: 'sell' },
    { price: 43250.90, quantity: 0.0920, time: '14:35:28', side: 'buy' },
  ]

  useEffect(() => {
    setOrderBook(mockOrderBook)
    setRecentTrades(mockTrades)
    // Fetch price history for selected pair
    const fetchPriceHistory = async () => {
      setLoadingChart(true);
      try {
        const res = await axios.get(`${API_BASE}/price-history/?pair=${selectedPair}`);
        // Expecting [{timestamp, price}, ...]
        const history = res.data.history || [];
        setPriceHistory(history);
        // If BTCUSDT, update BTC price in tradingPairs
        if (selectedPair === 'BTCUSDT' && history.length > 0) {
          const latestPrice = history[history.length - 1].price;
          setBtcPrice(latestPrice);
          setTradingPairs(prevPairs => prevPairs.map(pair =>
            pair.pair === 'BTCUSDT' ? { ...pair, price: latestPrice } : pair
          ));
        }
      } catch (err) {
        setPriceHistory([]);
      }
      setLoadingChart(false);
    };
    fetchPriceHistory();

    // Set up periodic refresh for BTC price
    let interval = null;
    if (selectedPair === 'BTCUSDT') {
      interval = setInterval(() => {
        fetchPriceHistory();
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedPair]);

  const handlePlaceOrder = () => {
    // Implement order placement logic
    console.log('Placing order:', { selectedPair, orderType, orderSide, price, quantity })
  }

  return (
    <Layout>
      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Trading Pairs */}
        <div className="col-span-3 bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-4">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            Markets
          </h3>
          <div className="space-y-2">
            {tradingPairs.map((pair) => (
              <div
                key={pair.pair}
                onClick={() => setSelectedPair(pair.pair)}
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  selectedPair === pair.pair
                    ? 'bg-purple-500/20 border border-purple-500/30'
                    : 'hover:bg-purple-500/10 border border-transparent'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium font-mono">{pair.pair}</span>
                  <span className={`text-sm font-mono ${pair.change.includes('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {pair.change}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-300 text-sm font-mono">${pair.price.toLocaleString()}</span>
                  <span className="text-gray-400 text-xs font-mono">Vol: {pair.volume}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Area */}
        <div className="col-span-6 bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-xl">{selectedPair}</h3>
            <div className="flex space-x-2">
              {['1m', '5m', '15m', '1h', '4h', '1d'].map((timeframe) => (
                <button
                  key={timeframe}
                  className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30 transition-colors"
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
          <div className="h-96 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl flex items-center justify-center border border-purple-500/10">
            {loadingChart ? (
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-purple-400 font-medium">Loading chart...</p>
              </div>
            ) : priceHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={priceHistory} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#8b5cf6" />
                  <XAxis dataKey="timestamp" tick={{ fill: '#a5b4fc', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#a5b4fc', fontSize: 12 }} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ background: '#1e1b4b', border: '1px solid #8b5cf6', color: '#fff' }} labelStyle={{ color: '#8b5cf6' }} />
                  <Line type="monotone" dataKey="price" stroke="#8b5cf6" strokeWidth={3} dot={false} isAnimationActive={true} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-400 font-medium">No price history available</p>
                <p className="text-gray-500 text-sm mt-2">Real-time price chart for {selectedPair}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Book & Recent Trades */}
        <div className="col-span-3 space-y-6">
          {/* Order Book */}
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8h6m-6 4h6" />
                </svg>
              </div>
              Order Book
            </h3>
            
            <div className="space-y-1 mb-4">
              <div className="grid grid-cols-3 text-xs text-gray-400 pb-2 border-b border-purple-500/20">
                <span>Price</span>
                <span>Amount</span>
                <span>Total</span>
              </div>
              
              {/* Asks (Sell Orders) */}
              {orderBook.asks.slice().reverse().map((ask, idx) => (
                <div key={idx} className="grid grid-cols-3 text-xs text-red-400 py-1 font-mono">
                  <span>{ask.price.toFixed(2)}</span>
                  <span>{ask.quantity.toFixed(4)}</span>
                  <span>{ask.total.toFixed(2)}</span>
                </div>
              ))}
              
              {/* Current Price */}
              <div className="py-2 text-center">
                <span className="text-white font-bold text-lg font-mono">43,250.50</span>
                <span className="text-green-400 text-sm ml-2 font-mono">+2.45%</span>
              </div>
              
              {/* Bids (Buy Orders) */}
              {orderBook.bids.map((bid, idx) => (
                <div key={idx} className="grid grid-cols-3 text-xs text-green-400 py-1 font-mono">
                  <span>{bid.price.toFixed(2)}</span>
                  <span>{bid.quantity.toFixed(4)}</span>
                  <span>{bid.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trades */}
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <span className="text-2xl mr-2">⚡</span>
              Recent Trades
            </h3>
            
            <div className="space-y-1">
              <div className="grid grid-cols-3 text-xs text-gray-400 pb-2 border-b border-purple-500/20">
                <span>Price</span>
                <span>Amount</span>
                <span>Time</span>
              </div>
              
              {recentTrades.map((trade, idx) => (
                <div key={idx} className={`grid grid-cols-3 text-xs py-1 font-mono ${trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                  <span>{trade.price.toFixed(2)}</span>
                  <span>{trade.quantity.toFixed(4)}</span>
                  <span className="text-gray-400">{trade.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trading Panel */}
        <div className="col-span-12 bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Buy Panel */}
            <div className="space-y-4">
              <h3 className="text-green-400 font-semibold text-lg flex items-center">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
                Buy {selectedPair.replace('USDT', '')}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setOrderType('market')}
                  className={`p-3 rounded-xl border transition-all ${
                    orderType === 'market'
                      ? 'bg-green-500/20 border-green-500/30 text-green-400'
                      : 'border-gray-600 text-gray-400 hover:border-green-500/30'
                  }`}
                >
                  Market
                </button>
                <button
                  onClick={() => setOrderType('limit')}
                  className={`p-3 rounded-xl border transition-all ${
                    orderType === 'limit'
                      ? 'bg-green-500/20 border-green-500/30 text-green-400'
                      : 'border-gray-600 text-gray-400 hover:border-green-500/30'
                  }`}
                >
                  Limit
                </button>
              </div>

              {orderType === 'limit' && (
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Price (USDT)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-black/30 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-300 text-sm mb-2">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-black/30 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              <div className="flex space-x-2">
                {['25%', '50%', '75%', '100%'].map((percent) => (
                  <button
                    key={percent}
                    className="flex-1 py-2 bg-gray-700/50 text-gray-300 rounded-lg text-sm hover:bg-green-500/20 hover:text-green-400 transition-colors"
                  >
                    {percent}
                  </button>
                ))}
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all"
              >
                Buy {selectedPair.replace('USDT', '')}
              </button>
            </div>

            {/* Sell Panel */}
            <div className="space-y-4">
              <h3 className="text-red-400 font-semibold text-lg flex items-center">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                </div>
                Sell {selectedPair.replace('USDT', '')}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  className="p-3 rounded-xl border border-gray-600 text-gray-400 hover:border-red-500/30 transition-all"
                >
                  Market
                </button>
                <button
                  className="p-3 rounded-xl border border-gray-600 text-gray-400 hover:border-red-500/30 transition-all"
                >
                  Limit
                </button>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Price (USDT)</label>
                <input
                  type="number"
                  className="w-full bg-black/30 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Quantity</label>
                <input
                  type="number"
                  className="w-full bg-black/30 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              <div className="flex space-x-2">
                {['25%', '50%', '75%', '100%'].map((percent) => (
                  <button
                    key={percent}
                    className="flex-1 py-2 bg-gray-700/50 text-gray-300 rounded-lg text-sm hover:bg-red-500/20 hover:text-red-400 transition-colors"
                  >
                    {percent}
                  </button>
                ))}
              </div>

              <button
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all"
              >
                Sell {selectedPair.replace('USDT', '')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Trading
