import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const products = [
  { 
    id: 1, 
    name: 'Wireless Headphones', 
    price: 12.5, 
    description: 'Premium noise-cancelling wireless headphones with superior sound quality',
    category: 'Electronics',
    rating: 4.8,
    reviews: 324
  },
  { 
    id: 2, 
    name: 'Bluetooth Speaker', 
    price: 8.3, 
    description: 'Portable high-quality Bluetooth speaker with 360° sound',
    category: 'Electronics',
    rating: 4.6,
    reviews: 198
  },
  { 
    id: 3, 
    name: 'Smart Watch', 
    price: 25.7, 
    description: 'Feature-rich smartwatch with health tracking and notifications',
    category: 'Electronics',
    rating: 4.9,
    reviews: 567
  },
  { 
    id: 4, 
    name: 'Digital Course', 
    price: 15.0, 
    description: 'Complete crypto trading masterclass with expert insights',
    category: 'Education',
    rating: 4.7,
    reviews: 89
  },
  { 
    id: 5, 
    name: 'Premium Software', 
    price: 22.2, 
    description: 'Professional productivity software suite for businesses',
    category: 'Software',
    rating: 4.5,
    reviews: 156
  },
  { 
    id: 6, 
    name: 'Gaming Accessory', 
    price: 18.9, 
    description: 'High-performance gaming mouse with RGB lighting',
    category: 'Gaming',
    rating: 4.8,
    reviews: 234
  }
]

// SVG Icons
const ShoppingCartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M6 19h9" />
  </svg>
)

const HeadphonesIcon = () => (
  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
)

const SpeakerIcon = () => (
  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12H4a1 1 0 00-1 1v6a1 1 0 001 1h5l7-7V8l-7-7H4a1 1 0 00-1 1v6a1 1 0 001 1h5z" />
  </svg>
)

const WatchIcon = () => (
  <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const BookIcon = () => (
  <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const ComputerIcon = () => (
  <svg className="w-12 h-12 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const GameIcon = () => (
  <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const getProductIcon = (id) => {
  const icons = {
    1: <HeadphonesIcon />,
    2: <SpeakerIcon />,
    3: <WatchIcon />,
    4: <BookIcon />,
    5: <ComputerIcon />,
    6: <GameIcon />
  }
  return icons[id] || <ComputerIcon />
}

const StarRating = ({ rating, reviews }) => (
  <div className="flex items-center space-x-1">
    {[...Array(5)].map((_, i) => (
      <svg 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="text-sm text-gray-600 ml-1">({reviews})</span>
  </div>
)

const Home = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [addedItems, setAddedItems] = useState(new Set())

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('curve_cart') || '[]')
    setCart(savedCart)
    setCartCount(savedCart.length)
    setAddedItems(new Set(savedCart.map(item => item.id)))
  }, [])

  const addToCart = (product) => {
    if (addedItems.has(product.id)) return
    
    const updated = [...cart, product]
    setCart(updated)
    setCartCount(updated.length)
    setAddedItems(prev => new Set([...prev, product.id]))
    localStorage.setItem('curve_cart', JSON.stringify(updated))
  }

  const paymentMethods = [
    { 
      name: 'Arc Wallet', 
      description: 'Pay with crypto instantly',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ), 
      color: 'from-purple-500 to-blue-500' 
    },
    { 
      name: 'Razorpay', 
      description: 'UPI, Cards, Net Banking',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ), 
      color: 'from-blue-500 to-indigo-500' 
    },
    { 
      name: 'Stripe', 
      description: 'Credit & Debit Cards',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ), 
      color: 'from-indigo-500 to-purple-500' 
    },
    { 
      name: 'PayPal', 
      description: 'Global payment solution',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ), 
      color: 'from-blue-400 to-blue-600' 
    }
  ]

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Curve</h1>
                <p className="text-sm text-gray-600">Premium Marketplace</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/orders")}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-white/50 transition-all"
              >
                Orders
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="relative bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:from-purple-700 hover:to-blue-600 transition-all transform hover:-translate-y-1 shadow-lg"
              >
                <ShoppingCartIcon />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Curve Marketplace</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover premium digital products with seamless crypto and traditional payment options. 
            Shop with confidence using our secure, multi-gateway payment system.
          </p>
          
          {/* Payment Methods Banner */}
          <div className="bg-white/95 backdrop-blur-md p-8 mb-12 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Multiple Payment Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paymentMethods.map((method, index) => (
                <div 
                  key={index}
                  className={`bg-gradient-to-r ${method.color} text-white p-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg`}
                >
                  <div className="flex items-center justify-center mb-3">
                    {method.icon}
                  </div>
                  <h4 className="font-bold text-lg mb-1">{method.name}</h4>
                  <p className="text-sm opacity-90">{method.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div 
                key={product.id} 
                className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-8">
                  <div className="flex items-center justify-center mb-6">
                    {getProductIcon(product.id)}
                  </div>
                  
                  <div className="mb-4">
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{product.description}</p>
                  
                  <div className="mb-4">
                    <StarRating rating={product.rating} reviews={product.reviews} />
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">{product.price} ARC</span>
                      <div className="text-sm text-gray-500">≈ ${(product.price * 0.45).toFixed(2)} USD</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => addToCart(product)}
                    disabled={addedItems.has(product.id)}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform ${
                      addedItems.has(product.id)
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 hover:-translate-y-1 shadow-lg'
                    }`}
                  >
                    {addedItems.has(product.id) ? (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Added to Cart
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <ShoppingCartIcon />
                        <span className="ml-2">Add to Cart</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 bg-white/95 backdrop-blur-md p-12 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Curve?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3">Bank-Level Security</h4>
              <p className="text-gray-600 leading-relaxed">Multiple payment options with enterprise-grade encryption and fraud protection</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3">Instant Delivery</h4>
              <p className="text-gray-600 leading-relaxed">Digital products delivered immediately after successful payment confirmation</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3">Global Access</h4>
              <p className="text-gray-600 leading-relaxed">Shop from anywhere worldwide with cryptocurrency and traditional payment support</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-20 bg-white/90 backdrop-blur-md border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Curve Marketplace. Built with Arc Technology.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
