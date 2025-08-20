import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

const Wallet = () => {
  const [wallets, setWallets] = useState([])
  const [selectedWallet, setSelectedWallet] = useState(null)
  const [showAddWallet, setShowAddWallet] = useState(false)
  const [newWalletType, setNewWalletType] = useState('BTC')
  const [transactions, setTransactions] = useState([])

  const mockWallets = [
    {
      id: 1,
      type: 'BTC',
      name: 'Bitcoin Wallet',
      balance: 2.5420,
      usdValue: 109875.25,
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      network: 'Bitcoin',
      isDefault: true
    },
    {
      id: 2,
      type: 'ETH',
      name: 'Ethereum Wallet',
      balance: 4.8750,
      usdValue: 12922.50,
      address: '0x742d35Cc7031C3e3E9F48B7e0E8c8F0bC8B1c3a5',
      network: 'Ethereum',
      isDefault: false
    },
    {
      id: 3,
      type: 'ARC',
      name: 'Arc Token Wallet',
      balance: 100.0000,
      usdValue: 12540.00,
      address: '0x9A8C8f7d2E5b4F8e1A3c5D7f9B2e4A6c8E1f3D5a',
      network: 'Ethereum',
      isDefault: false
    },
    {
      id: 4,
      type: 'BNB',
      name: 'Binance Coin Wallet',
      balance: 15.2500,
      usdValue: 4813.25,
      address: 'bnb1xy2h5ufzm8n3w5p4t7r9q2c6v8x0s4a1b3e5d7',
      network: 'BSC',
      isDefault: false
    },
    {
      id: 5,
      type: 'USDT',
      name: 'Tether Wallet',
      balance: 5000.0000,
      usdValue: 5000.00,
      address: '0x4F3b6A8D7e2C1f5B9c8E6a4D2f1b5A8c9E3d7F1a',
      network: 'Ethereum',
      isDefault: false
    }
  ]

  const mockTransactions = [
    {
      id: 1,
      type: 'receive',
      amount: 0.1250,
      currency: 'BTC',
      usdValue: 5387.50,
      from: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
      to: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      timestamp: '2024-01-15 14:30:22',
      status: 'confirmed',
      txHash: '0x123...abc',
      confirmations: 6
    },
    {
      id: 2,
      type: 'send',
      amount: 1.5000,
      currency: 'ETH',
      usdValue: 3967.80,
      from: '0x742d35Cc7031C3e3E9F48B7e0E8c8F0bC8B1c3a5',
      to: '0x8ba1f109551bD432803012645Hac136c5A8D5f',
      timestamp: '2024-01-15 12:15:45',
      status: 'confirmed',
      txHash: '0x456...def',
      confirmations: 12
    },
    {
      id: 3,
      type: 'receive',
      amount: 50.0000,
      currency: 'ARC',
      usdValue: 6240.00,
      from: '0x9f8d6e5c4b3a2f1e8d7c6b5a4f3e2d1c8b7a6f5e',
      to: '0x9A8C8f7d2E5b4F8e1A3c5D7f9B2e4A6c8E1f3D5a',
      timestamp: '2024-01-15 10:45:12',
      status: 'confirmed',
      txHash: '0x789...ghi',
      confirmations: 25
    }
  ]

  const supportedCurrencies = [
    { symbol: 'BTC', name: 'Bitcoin', network: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum', network: 'Ethereum' },
    { symbol: 'ARC', name: 'Arc Token', network: 'Ethereum' },
    { symbol: 'BNB', name: 'Binance Coin', network: 'BSC' },
    { symbol: 'USDT', name: 'Tether', network: 'Ethereum' },
    { symbol: 'ADA', name: 'Cardano', network: 'Cardano' },
    { symbol: 'SOL', name: 'Solana', network: 'Solana' },
    { symbol: 'DOT', name: 'Polkadot', network: 'Polkadot' }
  ]

  useEffect(() => {
    setWallets(mockWallets)
    setSelectedWallet(mockWallets[0])
    setTransactions(mockTransactions)
  }, [])

  const handleAddWallet = () => {
    const newWallet = {
      id: wallets.length + 1,
      type: newWalletType,
      name: `${supportedCurrencies.find(c => c.symbol === newWalletType)?.name} Wallet`,
      balance: 0,
      usdValue: 0,
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      network: supportedCurrencies.find(c => c.symbol === newWalletType)?.network,
      isDefault: false
    }
    setWallets([...wallets, newWallet])
    setShowAddWallet(false)
    setNewWalletType('BTC')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // You can add a toast notification here
  }

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.usdValue, 0)

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Wallet List */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold text-xl flex items-center">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              My Wallets
            </h3>
            <button
              onClick={() => setShowAddWallet(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-xl transition-colors"
            >
              <span className="text-xl">+</span>
            </button>
          </div>

          {/* Total Balance */}
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-4 mb-6">
            <p className="text-gray-300 text-sm">Total Balance</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalBalance)}</p>
          </div>

          {/* Wallet List */}
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                onClick={() => setSelectedWallet(wallet)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedWallet?.id === wallet.id
                    ? 'bg-purple-500/20 border border-purple-500/30'
                    : 'hover:bg-purple-500/10 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{
                        backgroundColor: wallet.type === 'BTC' ? '#f7931a' :
                                        wallet.type === 'ETH' ? '#627eea' :
                                        wallet.type === 'ARC' ? '#8b5cf6' :
                                        wallet.type === 'BNB' ? '#f3ba2f' :
                                        wallet.type === 'USDT' ? '#26a17b' : '#6b7280'
                      }}
                    >
                      {wallet.type}
                    </div>
                    <div>
                      <p className="text-white font-medium">{wallet.name}</p>
                      <p className="text-gray-400 text-sm">{wallet.network}</p>
                    </div>
                  </div>
                  {wallet.isDefault && (
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-white font-semibold">{wallet.balance.toFixed(4)} {wallet.type}</p>
                  <p className="text-gray-300 text-sm">{formatCurrency(wallet.usdValue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedWallet && (
            <>
              {/* Wallet Header */}
              <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
                      style={{
                        backgroundColor: selectedWallet.type === 'BTC' ? '#f7931a' :
                                        selectedWallet.type === 'ETH' ? '#627eea' :
                                        selectedWallet.type === 'ARC' ? '#8b5cf6' :
                                        selectedWallet.type === 'BNB' ? '#f3ba2f' :
                                        selectedWallet.type === 'USDT' ? '#26a17b' : '#6b7280'
                      }}
                    >
                      {selectedWallet.type}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-xl">{selectedWallet.name}</h3>
                      <p className="text-gray-400">{selectedWallet.network} Network</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl hover:bg-green-500/30 transition-colors">
                      Receive
                    </button>
                    <button className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl hover:bg-blue-500/30 transition-colors">
                      Send
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm">Balance</p>
                    <p className="text-2xl font-bold text-white">{selectedWallet.balance.toFixed(4)} {selectedWallet.type}</p>
                    <p className="text-gray-300">{formatCurrency(selectedWallet.usdValue)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Wallet Address</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-white font-mono text-sm truncate">{selectedWallet.address}</p>
                      <button
                        onClick={() => copyToClipboard(selectedWallet.address)}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-4 hover:bg-purple-500/10 transition-colors">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <p className="text-white font-medium">Send</p>
                  <p className="text-gray-400 text-sm">Transfer funds</p>
                </button>
                <button className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-4 hover:bg-purple-500/10 transition-colors">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                  </div>
                  <p className="text-white font-medium">Receive</p>
                  <p className="text-gray-400 text-sm">Get paid</p>
                </button>
                <button className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-4 hover:bg-purple-500/10 transition-colors">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <p className="text-white font-medium">Swap</p>
                  <p className="text-gray-400 text-sm">Exchange coins</p>
                </button>
                <button className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-4 hover:bg-purple-500/10 transition-colors">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <p className="text-white font-medium">Stake</p>
                  <p className="text-gray-400 text-sm">Earn rewards</p>
                </button>
              </div>

              {/* Transaction History */}
              <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
                <h3 className="text-white font-semibold text-xl mb-6">Transaction History</h3>
                
                <div className="space-y-4">
                  {transactions.filter(tx => tx.currency === selectedWallet.type).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'receive' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {transaction.type === 'receive' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {transaction.type === 'receive' ? 'Received' : 'Sent'} {transaction.currency}
                          </p>
                          <p className="text-gray-400 text-sm">{transaction.timestamp}</p>
                          <p className="text-gray-500 text-xs font-mono">
                            {transaction.txHash.slice(0, 10)}...{transaction.txHash.slice(-6)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.type === 'receive' ? 'text-green-400' : 'text-red-400'}`}>
                          {transaction.type === 'receive' ? '+' : '-'}{transaction.amount} {transaction.currency}
                        </p>
                        <p className="text-gray-300 text-sm">{formatCurrency(transaction.usdValue)}</p>
                        <div className="flex items-center justify-end space-x-1 mt-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-green-400 text-xs">{transaction.confirmations} confirmations</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Wallet Modal */}
      {showAddWallet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 w-full max-w-md">
            <h3 className="text-white font-semibold text-xl mb-6">Add New Wallet</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Select Currency</label>
                <select
                  value={newWalletType}
                  onChange={(e) => setNewWalletType(e.target.value)}
                  className="w-full bg-black/30 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                >
                  {supportedCurrencies.map((currency) => (
                    <option key={currency.symbol} value={currency.symbol}>
                      {currency.name} ({currency.symbol}) - {currency.network}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowAddWallet(false)}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddWallet}
                  className="flex-1 bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600 transition-colors"
                >
                  Add Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Wallet
