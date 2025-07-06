import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const products = [
  { id: 1, name: 'Wireless Headphones', price: 0.3 },
  { id: 2, name: 'Bluetooth Speaker', price: 0.5 },
  { id: 3, name: 'Smart Watch', price: 0.7 },
]

const Home = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    const updated = [...cart, product]
    setCart(updated)
    localStorage.setItem('curve_cart', JSON.stringify(updated))
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Curve 🛍️</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="border p-4 rounded shadow">
            <h2 className="text-xl">{p.name}</h2>
            <p className="mb-2">Price: {p.price} MATIC</p>
            <button
              onClick={() => addToCart(p)}
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button
          onClick={() => navigate("/cart")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Go to Cart
        </button>
      </div>
    </div>
  )
}

export default Home
