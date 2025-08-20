import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

const Trading = () => {
  const [selectedPair, setSelectedPair] = useState('BTCUSDT')
  const [orderType, setOrderType] = useState('limit')
  const [orderSide, setOrderSide] = useState('buy')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] })
  const [recentTrades, setRecentTrades] = useState([])
  
  const tradingPairs = [
    { pair: 'BTCUSDT', price: 43250.50, change: '+2.45%', volume: '1.2M' },
    { pair: 'ETHUSDT', price: 2650.80, change: '+1.85%', volume: '850K' },
    { pair: 'ARCUSDT', price: 125.40, change: '+5.20%', volume: '500K' },
    { pair: 'BNBUSDT', price: 315.60, change: '-0.75%', volume: '320K' },
    { pair: 'ADAUSDT', price: 0.485, change: '+3.15%', volume: '180K' },
  ]

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
  }, [selectedPair])

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
            <span className="text-2xl mr-2">📈</span>
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
                  <span className="text-white font-medium">{pair.pair}</span>
                  <span className={`text-sm ${pair.change.includes('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {pair.change}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-300 text-sm">${pair.price.toLocaleString()}</span>
                  <span className="text-gray-400 text-xs">Vol: {pair.volume}</span>
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
          
          {/* Placeholder for TradingView Chart */}
          <div className="h-96 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl flex items-center justify-center border border-purple-500/10">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-400">TradingView Chart Integration</p>
              <p className="text-gray-500 text-sm mt-2">Real-time price chart for {selectedPair}</p>
            </div>
          </div>
        </div>

        {/* Order Book & Recent Trades */}
        <div className="col-span-3 space-y-6">
          {/* Order Book */}
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <span className="text-2xl mr-2">📋</span>
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
                <div key={idx} className="grid grid-cols-3 text-xs text-red-400 py-1">
                  <span>{ask.price.toFixed(2)}</span>
                  <span>{ask.quantity.toFixed(4)}</span>
                  <span>{ask.total.toFixed(2)}</span>
                </div>
              ))}
              
              {/* Current Price */}
              <div className="py-2 text-center">
                <span className="text-white font-bold text-lg">43,250.50</span>
                <span className="text-green-400 text-sm ml-2">+2.45%</span>
              </div>
              
              {/* Bids (Buy Orders) */}
              {orderBook.bids.map((bid, idx) => (
                <div key={idx} className="grid grid-cols-3 text-xs text-green-400 py-1">
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
                <div key={idx} className={`grid grid-cols-3 text-xs py-1 ${trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
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
                <span className="text-2xl mr-2">📈</span>
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
                <span className="text-2xl mr-2">📉</span>
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
