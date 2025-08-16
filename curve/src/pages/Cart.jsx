import { useEffect, useState } from 'react'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [paymentStatus, setPaymentStatus] = useState('')
  const [isPaying, setIsPaying] = useState(false)

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
        setPaymentStatus(event.data.payload.status)
        if (event.data.payload.status === 'success') {
          localStorage.removeItem('curve_cart')
          setCartItems([])
          setTotal(0)
        }
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const handlePayWithArc = () => {
    setIsPaying(true)
    setPaymentStatus('')
    // Send message to extension to trigger payment popup
    if (window.chrome && window.chrome.runtime && window.chrome.runtime.sendMessage) {
      window.chrome.runtime.sendMessage(
        {
          type: 'ARC_PAYMENT_TRIGGER',
          payload: {
            amount: total,
            merchant_id: 'curve-merchant',
            items: cartItems
          }
        }
      )
    } else {
      // Fallback for dev: postMessage for local testing
      window.postMessage({
        type: 'ARC_PAYMENT_REQUEST',
        payload: {
          amount: total,
          merchant_id: 'curve-merchant',
          items: cartItems
        }
      }, '*')
    }
  }

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
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
      {paymentStatus && (
        <div className={`mt-6 p-4 rounded-lg text-center font-semibold ${paymentStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {paymentStatus === 'success' ? 'Payment Successful! 🎉' : 'Payment Failed. Please try again.'}
        </div>
      )}
    </div>
  )
}

export default Cart
