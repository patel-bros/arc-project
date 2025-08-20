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
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    2: (
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12H4a1 1 0 00-1 1v6a1 1 0 001 1h5l7-7V8l-7-7H4a1 1 0 00-1 1v6a1 1 0 001 1h5z" />
      </svg>
    ),
    3: (
      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    4: (
      <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    5: (
      <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    6: (
      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      if (event.data && event.data.type === 'ARC_PAYMENT_STATUS') {
        setIsPaying(false)
        const status = event.data.payload.status
        const amount = event.data.payload.amount
        const transactionId = event.data.payload.transactionId
        
        setPaymentStatus(status)
        
        if (status === 'success') {
          console.log(`Payment successful! Amount: ${amount} ARC, Transaction: ${transactionId}`)
          completeOrder(transactionId, amount, 'Arc Wallet')
        }
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
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
      color: 'from-purple-600 to-blue-500',
      hoverColor: 'from-purple-700 to-blue-600'
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'Credit/Debit Cards, UPI, Net Banking',
      color: 'from-blue-600 to-indigo-600',
      hoverColor: 'from-blue-700 to-indigo-700'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Global payment processing',
      color: 'from-indigo-600 to-purple-600',
      hoverColor: 'from-indigo-700 to-purple-700'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    }
  ]

  return (
    <div className="min-h-screen w-full animate-fadeInUp">
      {/* Header */}
      <div className="glass-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon />
                <span>Back to Shop</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ShoppingCartIcon />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
                <p className="text-sm text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!orderSuccess ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Cart Items</h2>
                
                {cartItems.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCartIcon />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Add some awesome products to get started!</p>
                    <button
                      onClick={() => navigate("/")}
                      className="btn-gradient-primary px-6 py-3 rounded-xl font-semibold hover-lift"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-4 p-6 bg-white rounded-2xl shadow-sm hover-lift border border-gray-100">
                        <div className="flex-shrink-0">
                          {getProductIcon(item.id)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          <div className="flex items-center mt-2">
                            <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                              {item.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xl font-bold text-gradient">{item.price} ARC</div>
                          <div className="text-sm text-gray-500">≈ ${(item.price * 0.45).toFixed(2)} USD</div>
                        </div>
                        
                        <button
                          onClick={() => {
                            const updated = cartItems.filter((_, i) => i !== idx)
                            setCartItems(updated)
                            setTotal(updated.reduce((sum, item) => sum + item.price, 0))
                            localStorage.setItem('curve_cart', JSON.stringify(updated))
                          }}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Section */}
            {cartItems.length > 0 && (
              <div className="lg:col-span-1">
                <div className="glass-card p-8 sticky top-28">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>{total.toFixed(2)} ARC</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Processing Fee</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">Total</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gradient">{total.toFixed(2)} ARC</div>
                          <div className="text-sm text-gray-500">≈ ${(total * 0.45).toFixed(2)} USD</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    disabled={isPaying}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      isPaying 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'btn-gradient-primary hover-lift'
                    }`}
                  >
                    {isPaying ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </button>
                  
                  {paymentStatus && (
                    <div className={`mt-4 p-4 rounded-lg text-center ${
                      paymentStatus.includes('success') || paymentStatus.includes('successful')
                        ? 'bg-green-100 text-green-800'
                        : paymentStatus.includes('failed') || paymentStatus.includes('error')
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {paymentStatus}
                    </div>
                  )}
                  
                  {/* Security Features */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Security Features</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CheckIcon />
                        <span className="ml-2">SSL Encrypted</span>
                      </div>
                      <div className="flex items-center">
                        <CheckIcon />
                        <span className="ml-2">PCI Compliant</span>
                      </div>
                      <div className="flex items-center">
                        <CheckIcon />
                        <span className="ml-2">Instant Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Order Success */
          <div className="max-w-2xl mx-auto text-center glass-card p-12">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckIcon />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Complete!</h2>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for your purchase. Your digital products have been delivered to your account.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/orders")}
                className="btn-gradient-primary px-8 py-3 rounded-xl font-semibold hover-lift mr-4"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-card max-w-md w-full mx-4 max-h-screen overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Choose Payment Method</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all"
                disabled={isPaying}
              >
                <XIcon />
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-xl font-bold text-gradient">{total.toFixed(2)} ARC</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                <span>USD Equivalent:</span>
                <span>${(total * 0.45).toFixed(2)}</span>
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
                  className={`w-full p-5 rounded-xl transition-all duration-300 transform hover-scale ${
                    isPaying ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                  } bg-gradient-to-r ${method.color} text-white`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      {method.id === 'arc' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                      {method.id === 'razorpay' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      )}
                      {method.id === 'stripe' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      )}
                      {method.id === 'paypal' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-lg">{method.name}</div>
                      <div className="text-sm opacity-90">{method.description}</div>
                    </div>
                    <div className="text-xl">→</div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                All payments are secure and encrypted. Your payment information is protected.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
