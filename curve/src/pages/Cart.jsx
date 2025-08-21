import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// SVG Icons
const ShoppingCartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M6 19h9" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const getProductIcon = (id) => {
  const iconMap = {
    1: (
      <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    2: (
      <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12H4a1 1 0 00-1 1v6a1 1 0 001 1h5l7-7V8l-7-7H4a1 1 0 00-1 1v6a1 1 0 001 1h5z" />
      </svg>
    ),
    3: (
      <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    4: (
      <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    5: (
      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    6: (
      <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
  
  return iconMap[id] || iconMap[1]
}

const Cart = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [paymentStatus, setPaymentStatus] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('curve_cart')) || []
    setCartItems(items)
    setTotal(items.reduce((sum, item) => sum + item.price, 0))
  }, [])

  useEffect(() => {
    // Listen for payment status from extension
    function handleMessage(event) {
      console.log('[CURVE] Received message:', event.data); // Debug log
      if (event.data && event.data.type === 'ARC_PAYMENT_STATUS') {
        console.log('[CURVE] Payment status received:', event.data.payload); // Debug log
        setIsPaying(false)
        const status = event.data.payload.status
        const amount = event.data.payload.amount
        const transactionId = event.data.payload.transactionId
        
        setPaymentStatus(status)
        
        if (status === 'success') {
          console.log(`[CURVE] Payment successful! Amount: ${amount} ARC, Transaction: ${transactionId}`)
          completeOrder(transactionId, amount, 'Arc Wallet')
        } else if (status === 'failed') {
          console.log('[CURVE] Payment failed')
          setPaymentStatus('Payment failed. Please try again.')
        } else if (status === 'cancelled') {
          console.log('[CURVE] Payment cancelled')
          const reason = event.data.payload.reason || 'Payment was cancelled'
          setPaymentStatus(`Payment cancelled: ${reason}`)
          // Reset the UI to allow retry
          setTimeout(() => {
            setPaymentStatus(null)
          }, 3000)
        }
      }
    }
    
    console.log('[CURVE] Setting up message listener'); // Debug log
    window.addEventListener('message', handleMessage)
    return () => {
      console.log('[CURVE] Removing message listener'); // Debug log
      window.removeEventListener('message', handleMessage)
    }
  }, [cartItems, total])

  const completeOrder = (transactionId, amount, paymentMethod) => {
    // Save order to history
    const orderData = {
      id: transactionId || Date.now(),
      items: cartItems,
      total: amount || total,
      date: new Date().toISOString(),
      status: 'completed',
      paymentMethod: paymentMethod
    }
    
    const existingOrders = JSON.parse(localStorage.getItem('curve_orders')) || []
    existingOrders.push(orderData)
    localStorage.setItem('curve_orders', JSON.stringify(existingOrders))
    
    // Clear cart
    localStorage.removeItem('curve_cart')
    setCartItems([])
    setTotal(0)
    setOrderSuccess(orderData)
    setPaymentStatus('success')
  }

  const handlePayWithArc = () => {
    if (!cartItems.length) return
    
    setIsPaying(true)
    setPaymentStatus('Connecting to Arc Wallet...')
    
    const paymentMessage = {
      type: 'ARC_PAYMENT_REQUEST',
      payload: {
        amount: total,
        currency: 'ARC',
        recipient: 'curve_marketplace',
        items: cartItems
      }
    }
    
    console.log('Sending payment message:', paymentMessage);
    window.postMessage(paymentMessage, '*')
    
    // Add a timeout to check if extension responds
    setTimeout(() => {
      if (isPaying) {
        console.log('No response from extension after 3 seconds');
      }
    }, 3000);
  }

  const handleTraditionalPayment = (method) => {
    setIsPaying(true)
    setPaymentStatus(`Processing ${method} payment...`)
    
    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.1 // 90% success rate
      if (success) {
        const transactionId = `${method.toLowerCase()}_${Date.now()}`
        completeOrder(transactionId, total, method)
      } else {
        setIsPaying(false)
        setPaymentStatus(`${method} payment failed. Please try again.`)
      }
    }, 2000)
  }

  const paymentMethods = [
    {
      id: 'arc',
      name: 'Arc Wallet',
      description: 'Pay with cryptocurrency instantly',
      color: 'from-cyan-500 via-blue-500 to-purple-600',
      hoverColor: 'from-cyan-600 via-blue-600 to-purple-700'
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'Credit/Debit Cards, UPI, Net Banking',
      color: 'from-blue-500 via-indigo-500 to-purple-500',
      hoverColor: 'from-blue-600 via-indigo-600 to-purple-600'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Global payment processing',
      color: 'from-emerald-500 via-teal-500 to-cyan-500',
      hoverColor: 'from-emerald-600 via-teal-600 to-cyan-600'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      color: 'from-violet-500 via-purple-500 to-pink-500',
      hoverColor: 'from-violet-600 via-purple-600 to-pink-600'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800/50 transition-all duration-300 font-medium"
              >
                <ArrowLeftIcon />
                <span>Back to Shop</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <ShoppingCartIcon />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Your Cart
                </h1>
                <p className="text-sm text-slate-400 font-medium">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-12">
        {!orderSuccess ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl hover:bg-slate-800/60 transition-all duration-500 p-8">
                <h2 className="text-3xl font-bold text-white mb-8">Cart Items</h2>
                
                {cartItems.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <ShoppingCartIcon />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Your cart is empty</h3>
                    <p className="text-slate-400 mb-8 text-lg">Add some awesome products to get started!</p>
                    <button
                      onClick={() => navigate("/")}
                      className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="group relative backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:bg-slate-800/60 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 p-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative flex items-center space-x-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-cyan-500/30">
                              {getProductIcon(item.id)}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">{item.name}</h3>
                            <p className="text-slate-300 mt-2 leading-relaxed">{item.description}</p>
                            <div className="flex items-center mt-3">
                              <span className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/30">
                                {item.category}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">{item.price} ARC</div>
                            <div className="text-sm text-slate-400 font-medium">≈ ${(item.price * 0.45).toFixed(2)} USD</div>
                          </div>
                          
                          <button
                            onClick={() => {
                              const updated = cartItems.filter((_, i) => i !== idx)
                              setCartItems(updated)
                              setTotal(updated.reduce((sum, item) => sum + item.price, 0))
                              localStorage.setItem('curve_cart', JSON.stringify(updated))
                            }}
                            className="text-red-400 hover:text-red-300 p-3 hover:bg-red-500/10 rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-400/50"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Section */}
            {cartItems.length > 0 && (
              <div className="lg:col-span-1">
                <div className="backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl hover:bg-slate-800/60 transition-all duration-500 p-8 sticky top-28">
                  <h2 className="text-3xl font-bold text-white mb-8">Order Summary</h2>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex justify-between text-slate-300 text-lg">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span className="font-semibold">{total.toFixed(2)} ARC</span>
                    </div>
                    <div className="flex justify-between text-slate-300 text-lg">
                      <span>Processing Fee</span>
                      <span className="text-emerald-400 font-bold">Free</span>
                    </div>
                    <div className="border-t border-slate-700/50 pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-white">Total</span>
                        <div className="text-right">
                          <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">{total.toFixed(2)} ARC</div>
                          <div className="text-sm text-slate-400 font-medium">≈ ${(total * 0.45).toFixed(2)} USD</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    disabled={isPaying}
                    className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 transform ${
                      isPaying 
                        ? 'bg-slate-600 cursor-not-allowed text-slate-400' 
                        : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white hover:shadow-xl hover:shadow-cyan-500/25 hover:-translate-y-1 active:translate-y-0'
                    }`}
                  >
                    {isPaying ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Processing...
                      </div>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </button>
                  
                  {paymentStatus && (
                    <div className={`mt-6 p-4 rounded-xl text-center font-medium ${
                      paymentStatus.includes('success') || paymentStatus.includes('successful')
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : paymentStatus.includes('failed') || paymentStatus.includes('error')
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {paymentStatus}
                    </div>
                  )}
                  
                  {/* Security Features */}
                  <div className="mt-8 pt-6 border-t border-slate-700/50">
                    <h3 className="font-bold text-white mb-4 text-lg">Security Features</h3>
                    <div className="space-y-3 text-sm text-slate-300">
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                          <CheckIcon />
                        </div>
                        <span>SSL Encrypted</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                          <CheckIcon />
                        </div>
                        <span>PCI Compliant</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                          <CheckIcon />
                        </div>
                        <span>Instant Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Order Success */
          <div className="max-w-2xl mx-auto text-center backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl hover:bg-slate-800/60 transition-all duration-500 p-12">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/25">
              <CheckIcon />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">Order Complete!</h2>
            <p className="text-xl text-slate-300 mb-12 leading-relaxed">
              Thank you for your purchase. Your digital products have been delivered to your account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/orders")}
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate("/")}
                className="backdrop-blur-xl bg-slate-700/50 border border-slate-600/50 text-slate-200 px-8 py-4 rounded-xl font-bold hover:bg-slate-700/70 hover:border-slate-500/50 transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-slate-800/90 border border-slate-700/50 rounded-3xl shadow-2xl max-w-md w-full max-h-screen overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Choose Payment Method</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-white p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-300"
                disabled={isPaying}
              >
                <XIcon />
              </button>
            </div>
            
            <div className="mb-8 p-6 bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-2xl border border-slate-600/30">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-lg">Total Amount:</span>
                <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">{total.toFixed(2)} ARC</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 mt-2">
                <span>USD Equivalent:</span>
                <span className="font-medium">${(total * 0.45).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedPaymentMethod(method.id)
                    if (method.id === 'arc') {
                      setShowPaymentModal(false)
                      handlePayWithArc()
                    } else {
                      setShowPaymentModal(false)
                      handleTraditionalPayment(method.name)
                    }
                  }}
                  disabled={isPaying}
                  className={`w-full p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                    isPaying ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
                  } bg-gradient-to-r ${method.color} text-white shadow-lg`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      {method.id === 'arc' && (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                      {method.id === 'razorpay' && (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      )}
                      {method.id === 'stripe' && (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      )}
                      {method.id === 'paypal' && (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-xl">{method.name}</div>
                      <div className="text-sm opacity-90 font-medium">{method.description}</div>
                    </div>
                    <div className="text-2xl font-bold">→</div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400 leading-relaxed">
                All payments are secure and encrypted. Your payment information is protected by industry-leading security measures.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
