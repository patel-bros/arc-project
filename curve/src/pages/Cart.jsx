import { useEffect, useState } from 'react'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('curve_cart')) || []
    setCartItems(items)
    setTotal(items.reduce((sum, item) => sum + item.price, 0))
  }, [])

  const handlePayWithArc = () => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0)
    console.log("Total amount to pay:", total)
  window.postMessage({
    type: "ARC_PAYMENT_REQUEST",
    payload: {
      amount: total,
      merchant_id: "merchant123"
    }
  }, "*");
  console.log("Payment request sent to Arc extension")
}

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      <ul className="mb-4">
        {cartItems.map((item, idx) => (
          <li key={idx} className="mb-2">""
            {item.name} - {item.price} MATIC
          </li>
        ))}
      </ul>
      <p className="font-semibold mb-4">Total: {total.toFixed(2)} MATIC</p>
      <button
        onClick={handlePayWithArc}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        Pay with Arc
      </button>
    </div>
  )
}

export default Cart
