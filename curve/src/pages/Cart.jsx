import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [paymentStatus, setPaymentStatus] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

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
          
          // Save order to history
          const orderData = {
            id: transactionId || Date.now(),
            items: cartItems,
            total: amount || total,
            date: new Date().toISOString(),
            status: 'completed',
            paymentMethod: 'Arc Wallet'
          }
          
          const existingOrders = JSON.parse(localStorage.getItem('curve_orders') || '[]')
          existingOrders.unshift(orderData)  // Add to beginning of array
          localStorage.setItem('curve_orders', JSON.stringify(existingOrders))
          
          // Set order success state
          setOrderSuccess(true)
          setPaymentStatus('Order Placed Successfully! 🎉')
          
          // Clear cart
          localStorage.removeItem('curve_cart')
          setCartItems([])
          setTotal(0)
          
          // Show order success message with countdown
          let countdown = 3
          const redirectInterval = setInterval(() => {
            setPaymentStatus(`Order Placed Successfully! 🎉\nRedirecting to home in ${countdown} seconds...`)
            countdown--
            
            if (countdown < 0) {
              clearInterval(redirectInterval)
              navigate('/')  // Redirect to home page
            }
          }, 1000)
        }
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const handlePayWithArc = () => {
    setIsPaying(true)
    setPaymentStatus('')
    
    console.log('=== PAY WITH ARC CLICKED ===');
    console.log('Total amount:', total);
    console.log('Current URL:', window.location.href);
    
    // Send message to trigger Arc extension payment via content script
    const paymentMessage = {
      type: 'ARC_PAYMENT_REQUEST',
      payload: {
        amount: total,
        merchant_id: 'curve-merchant',
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

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      {!orderSuccess ? (
        <>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h1>
          <ul className="mb-6 divide-y divide-gray-200">
            {cartItems.length === 0 && <li className="text-gray-500">Your cart is empty.</li>}
            {cartItems.map((item, idx) => (
              <li key={idx} className="py-2 flex justify-between items-center">
                <span className="font-medium text-gray-700">{item.name}</span>
                <span className="text-gray-600">{item.price} ARC</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mb-6">
            <span className="font-semibold text-lg">Total:</span>
            <span className="font-bold text-xl text-purple-700">{total.toFixed(2)} ARC</span>
          </div>
          <button
            onClick={handlePayWithArc}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:from-purple-700 hover:to-blue-600 transition"
            disabled={cartItems.length === 0 || isPaying}
          >
            {isPaying ? 'Processing...' : 'Pay with Arc'}
          </button>
        </>
      ) : (
        <div className="text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-4">Thank you for your purchase with Arc Wallet</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-semibold">Payment Details:</p>
              <p className="text-green-700">Amount: {total.toFixed(2)} ARC</p>
              <p className="text-green-700">Payment Method: Arc Wallet</p>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-600 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
      
      {paymentStatus && (
        <div className={`mt-6 p-4 rounded-lg text-center font-semibold whitespace-pre-line ${
          paymentStatus === 'success' || paymentStatus.includes('Order Placed Successfully') || orderSuccess 
            ? 'bg-green-100 text-green-700 border-2 border-green-300' 
            : 'bg-red-100 text-red-700'
        }`}>
          {paymentStatus === 'success' ? 'Payment Successful! 🎉' : 
           paymentStatus.includes('Order Placed Successfully') ? paymentStatus :
           paymentStatus === 'failed' ? 'Payment Failed. Please try again.' : paymentStatus}
        </div>
      )}
    </div>
  )
}

export default Cart
