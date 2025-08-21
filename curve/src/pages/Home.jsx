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
    reviews: 324,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format'
  },
  { 
    id: 2, 
    name: 'Bluetooth Speaker', 
    price: 8.3, 
    description: 'Portable high-quality Bluetooth speaker with 360° sound',
    category: 'Electronics',
    rating: 4.6,
    reviews: 198,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop&auto=format'
  },
  { 
    id: 3, 
    name: 'Smart Watch', 
    price: 25.7, 
    description: 'Feature-rich smartwatch with health tracking and notifications',
    category: 'Electronics',
    rating: 4.9,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&auto=format'
  },
  { 
    id: 4, 
    name: 'Digital Course', 
    price: 15.0, 
    description: 'Complete crypto trading masterclass with expert insights',
    category: 'Education',
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&auto=format'
  },
  { 
    id: 5, 
    name: 'Premium Software', 
    price: 22.2, 
    description: 'Professional productivity software suite for businesses',
    category: 'Software',
    rating: 4.5,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&auto=format'
  },
  { 
    id: 6, 
    name: 'Gaming Accessory', 
    price: 18.9, 
    description: 'High-performance gaming mouse with RGB lighting',
    category: 'Gaming',
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop&auto=format'
  }
]

// SVG Icons with enhanced styling
const ShoppingCartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M6 19h9" />
  </svg>
)

const HeadphonesIcon = () => (
  <svg className="w-16 h-16 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
)

const SpeakerIcon = () => (
  <svg className="w-16 h-16 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12H4a1 1 0 00-1 1v6a1 1 0 001 1h5l7-7V8l-7-7H4a1 1 0 00-1 1v6a1 1 0 001 1h5z" />
  </svg>
)

const WatchIcon = () => (
  <svg className="w-16 h-16 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const BookIcon = () => (
  <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const ComputerIcon = () => (
  <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const GameIcon = () => (
  <svg className="w-16 h-16 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const getProductIcon = (product) => {
  return (
    <div className="relative w-full h-48 mb-6 overflow-hidden rounded-2xl group-hover:scale-105 transition-transform duration-300">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.target.src = `https://via.placeholder.com/400x300/1e293b/06b6d4?text=${encodeURIComponent(product.name)}`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-4 right-4">
        <span className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/30 backdrop-blur-md">
          {product.category}
        </span>
      </div>
    </div>
  )
}

const StarRating = ({ rating, reviews }) => (
  <div className="flex items-center space-x-2">
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg 
          key={i} 
          className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-slate-600'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <span className="text-sm text-slate-400 font-medium">({reviews})</span>
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
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Curve
                </h1>
                <p className="text-sm text-slate-400 font-medium">Next-Gen Marketplace</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate("/orders")}
                className="text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800/50 transition-all duration-300 font-medium"
              >
                Orders
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold flex items-center space-x-3 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                <ShoppingCartIcon />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full h-7 w-7 flex items-center justify-center animate-bounce font-bold shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="mb-8">
            <h2 className="text-6xl lg:text-7xl font-black mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                Curve
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
              Experience the future of digital commerce with seamless{' '}
              <span className="text-cyan-400 font-semibold">crypto payments</span> and 
              cutting-edge technology
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section>
          <div className="text-center mb-12">
            <h3 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Featured{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Products
              </span>
            </h3>
            <p className="text-slate-400 text-lg font-medium">Discover premium digital products at unbeatable prices</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div 
                key={product.id} 
                className="group relative backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden hover:bg-slate-800/60 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative p-8">
                  {getProductIcon(product)}
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="mb-6">
                    <StarRating rating={product.rating} reviews={product.reviews} />
                  </div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        {product.price} ARC
                      </div>
                      <div className="text-sm text-slate-400 font-medium">
                        ≈ ${(product.price * 0.45).toFixed(2)} USD
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => addToCart(product)}
                    disabled={addedItems.has(product.id)}
                    className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 transform ${
                      addedItems.has(product.id)
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white cursor-not-allowed shadow-lg shadow-emerald-500/25'
                        : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white hover:shadow-xl hover:shadow-cyan-500/25 hover:-translate-y-1 active:translate-y-0'
                    }`}
                  >
                    {addedItems.has(product.id) ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Added to Cart</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <ShoppingCartIcon />
                        <span>Add to Cart</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comprehensive Payment Options Section */}
        <section className="mt-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Multiple{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Payment Methods
              </span>
            </h3>
            <p className="text-slate-400 text-lg font-medium max-w-3xl mx-auto">
              Choose from our wide range of secure payment options. From cutting-edge cryptocurrency to traditional banking methods.
            </p>
          </div>

          {/* Crypto Payments */}
          <div className="backdrop-blur-xl bg-slate-800/30 border border-slate-700/50 p-10 rounded-3xl shadow-2xl mb-12 hover:bg-slate-800/40 transition-all duration-500">
            <div className="text-center mb-10">
              <h4 className="text-3xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Cryptocurrency Payments
                </span>
              </h4>
              <p className="text-slate-300 font-medium">Instant, secure, and decentralized payments</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { 
                  name: 'Arc Wallet', 
                  description: 'Native ARC Token',
                  icon: '⚡',
                  color: 'from-cyan-500 via-blue-500 to-purple-600',
                  glow: 'shadow-cyan-500/50'
                },
                { 
                  name: 'Bitcoin', 
                  description: 'BTC Payments',
                  icon: '₿',
                  color: 'from-orange-500 via-yellow-500 to-orange-600',
                  glow: 'shadow-orange-500/50'
                },
                { 
                  name: 'Ethereum', 
                  description: 'ETH & ERC-20',
                  icon: '◊',
                  color: 'from-blue-500 via-indigo-500 to-purple-500',
                  glow: 'shadow-blue-500/50'
                },
                { 
                  name: 'USDT/USDC', 
                  description: 'Stable Coins',
                  icon: '$',
                  color: 'from-emerald-500 via-teal-500 to-cyan-500',
                  glow: 'shadow-emerald-500/50'
                }
              ].map((crypto, index) => (
                <div 
                  key={index}
                  className={`relative group bg-gradient-to-br ${crypto.color} p-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl ${crypto.glow} hover:shadow-2xl cursor-pointer`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
                  <div className="relative text-center">
                    <div className="text-4xl mb-3">{crypto.icon}</div>
                    <h5 className="font-bold text-lg mb-2 text-white">{crypto.name}</h5>
                    <p className="text-sm text-white/90 font-medium">{crypto.description}</p>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Traditional Payments */}
          <div className="backdrop-blur-xl bg-slate-800/30 border border-slate-700/50 p-10 rounded-3xl shadow-2xl mb-12 hover:bg-slate-800/40 transition-all duration-500">
            <div className="text-center mb-10">
              <h4 className="text-3xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                  Traditional Payment Methods
                </span>
              </h4>
              <p className="text-slate-300 font-medium">Familiar and trusted payment options</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: 'Credit & Debit Cards',
                  providers: ['Visa', 'MasterCard', 'American Express', 'Discover'],
                  icon: (
                    <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  ),
                  color: 'from-blue-500 to-indigo-600'
                },
                {
                  name: 'Digital Wallets',
                  providers: ['PayPal', 'Apple Pay', 'Google Pay', 'Samsung Pay'],
                  icon: (
                    <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  color: 'from-purple-500 to-pink-600'
                },
                {
                  name: 'Bank Transfers',
                  providers: ['UPI', 'SEPA', 'Wire Transfer', 'ACH'],
                  icon: (
                    <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                  ),
                  color: 'from-emerald-500 to-teal-600'
                }
              ].map((method, index) => (
                <div 
                  key={index}
                  className={`bg-gradient-to-br ${method.color} p-8 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl cursor-pointer group`}
                >
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                      {method.icon}
                    </div>
                    <h5 className="font-bold text-xl text-white mb-3">{method.name}</h5>
                  </div>
                  <div className="space-y-2">
                    {method.providers.map((provider, idx) => (
                      <div key={idx} className="flex items-center justify-center">
                        <span className="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                          {provider}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Security Features */}
          <div className="backdrop-blur-xl bg-slate-800/30 border border-slate-700/50 p-10 rounded-3xl shadow-2xl hover:bg-slate-800/40 transition-all duration-500">
            <div className="text-center mb-10">
              <h4 className="text-3xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Security & Trust
                </span>
              </h4>
              <p className="text-slate-300 font-medium">Your payments are protected by industry-leading security</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: 'SSL Encryption',
                  description: '256-bit security'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ),
                  title: 'PCI Compliant',
                  description: 'Industry standard'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  title: 'Instant Processing',
                  description: 'Real-time verification'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  ),
                  title: '24/7 Support',
                  description: 'Always here to help'
                }
              ].map((feature, index) => (
                <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300 text-white">
                    {feature.icon}
                  </div>
                  <h5 className="font-bold text-lg text-white mb-2">{feature.title}</h5>
                  <p className="text-slate-400 text-sm font-medium">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-24">
          <div className="backdrop-blur-xl bg-slate-800/30 border border-slate-700/50 p-12 rounded-3xl shadow-2xl hover:bg-slate-800/40 transition-all duration-500">
            <h3 className="text-4xl font-bold text-center text-white mb-16">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Curve?
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-cyan-500/25">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse"></div>
                </div>
                <h4 className="text-2xl font-bold mb-4 text-white">Bank-Level Security</h4>
                <p className="text-slate-300 leading-relaxed font-medium">
                  Enterprise-grade encryption with multi-layer fraud protection for all transactions
                </p>
              </div>
              
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-emerald-500/25">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                </div>
                <h4 className="text-2xl font-bold mb-4 text-white">Lightning Fast</h4>
                <p className="text-slate-300 leading-relaxed font-medium">
                  Instant delivery and processing with real-time blockchain confirmations
                </p>
              </div>
              
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-purple-500/25">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                </div>
                <h4 className="text-2xl font-bold mb-4 text-white">Global Access</h4>
                <p className="text-slate-300 leading-relaxed font-medium">
                  Worldwide availability with multi-currency support and localized payments
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 mt-24 border-t border-slate-800/50 backdrop-blur-xl bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mb-6">
              <h4 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
                Curve Marketplace
              </h4>
              <p className="text-slate-400 font-medium">Built with Arc Technology</p>
            </div>
            <p className="text-slate-500 text-sm">&copy; 2025 Curve Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
