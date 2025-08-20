import { useState } from 'react'
import Layout from '../components/Layout'

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile')
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    timezone: 'UTC-5 (EST)',
    language: 'English'
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    loginNotifications: true,
    apiAccess: false
  })

  const [tradingSettings, setTradingSettings] = useState({
    defaultTradingPair: 'BTCUSDT',
    orderConfirmation: true,
    priceAlerts: true,
    autoRefresh: 5, // seconds
    chartTheme: 'dark',
    defaultOrderType: 'limit'
  })

  const sections = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'trading', name: 'Trading', icon: '📈' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'api', name: 'API Keys', icon: '🔑' },
    { id: 'advanced', name: 'Advanced', icon: '⚙️' }
  ]

  const handleProfileUpdate = () => {
    // Handle profile update
    console.log('Profile updated:', profileData)
  }

  const handleSecurityToggle = (setting) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Settings Navigation */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
          <h3 className="text-white font-semibold text-xl mb-6 flex items-center">
            <span className="text-2xl mr-2">⚙️</span>
            Settings
          </h3>
          
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                  activeSection === section.id
                    ? 'bg-purple-500/20 border border-purple-500/30 text-white'
                    : 'hover:bg-purple-500/10 border border-transparent text-gray-400'
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                <span className="font-medium">{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
          {activeSection === 'profile' && (
            <div>
              <h3 className="text-white font-semibold text-2xl mb-6">Profile Settings</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full bg-black/30 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full bg-black/30 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full bg-black/30 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Country</label>
                    <select
                      value={profileData.country}
                      onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                      className="w-full bg-black/30 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Timezone</label>
                    <select
                      value={profileData.timezone}
                      onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                      className="w-full bg-black/30 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="UTC-8 (PST)">UTC-8 (PST)</option>
                      <option value="UTC-5 (EST)">UTC-5 (EST)</option>
                      <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                      <option value="UTC+1 (CET)">UTC+1 (CET)</option>
                      <option value="UTC+9 (JST)">UTC+9 (JST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Language</label>
                    <select
                      value={profileData.language}
                      onChange={(e) => setProfileData({...profileData, language: e.target.value})}
                      className="w-full bg-black/30 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Chinese">Chinese</option>
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={handleProfileUpdate}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl transition-colors"
                >
                  Update Profile
                </button>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div>
              <h3 className="text-white font-semibold text-2xl mb-6">Security Settings</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                      <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorEnabled}
                        onChange={() => handleSecurityToggle('twoFactorEnabled')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium">Email Notifications</h4>
                      <p className="text-gray-400 text-sm">Receive security alerts via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.emailNotifications}
                        onChange={() => handleSecurityToggle('emailNotifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium">SMS Notifications</h4>
                      <p className="text-gray-400 text-sm">Receive security alerts via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.smsNotifications}
                        onChange={() => handleSecurityToggle('smsNotifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium">Login Notifications</h4>
                      <p className="text-gray-400 text-sm">Get notified of new login attempts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.loginNotifications}
                        onChange={() => handleSecurityToggle('loginNotifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium text-lg">Password & Login</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="bg-blue-500/20 text-blue-400 px-6 py-3 rounded-xl hover:bg-blue-500/30 transition-colors">
                      Change Password
                    </button>
                    <button className="bg-red-500/20 text-red-400 px-6 py-3 rounded-xl hover:bg-red-500/30 transition-colors">
                      Logout All Devices
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'trading' && (
            <div>
              <h3 className="text-white font-semibold text-2xl mb-6">Trading Preferences</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Default Trading Pair</label>
                    <select
                      value={tradingSettings.defaultTradingPair}
                      onChange={(e) => setTradingSettings({...tradingSettings, defaultTradingPair: e.target.value})}
                      className="w-full bg-black/30 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="BTCUSDT">BTC/USDT</option>
                      <option value="ETHUSDT">ETH/USDT</option>
                      <option value="ARCUSDT">ARC/USDT</option>
                      <option value="BNBUSDT">BNB/USDT</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Default Order Type</label>
                    <select
                      value={tradingSettings.defaultOrderType}
                      onChange={(e) => setTradingSettings({...tradingSettings, defaultOrderType: e.target.value})}
                      className="w-full bg-black/30 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="limit">Limit Order</option>
                      <option value="market">Market Order</option>
                      <option value="stop">Stop Order</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Chart Theme</label>
                    <select
                      value={tradingSettings.chartTheme}
                      onChange={(e) => setTradingSettings({...tradingSettings, chartTheme: e.target.value})}
                      className="w-full bg-black/30 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Auto Refresh (seconds)</label>
                    <select
                      value={tradingSettings.autoRefresh}
                      onChange={(e) => setTradingSettings({...tradingSettings, autoRefresh: parseInt(e.target.value)})}
                      className="w-full bg-black/30 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value={1}>1 second</option>
                      <option value={5}>5 seconds</option>
                      <option value={10}>10 seconds</option>
                      <option value={30}>30 seconds</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium">Order Confirmation</h4>
                      <p className="text-gray-400 text-sm">Require confirmation before placing orders</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tradingSettings.orderConfirmation}
                        onChange={(e) => setTradingSettings({...tradingSettings, orderConfirmation: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium">Price Alerts</h4>
                      <p className="text-gray-400 text-sm">Receive notifications for price movements</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tradingSettings.priceAlerts}
                        onChange={(e) => setTradingSettings({...tradingSettings, priceAlerts: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'api' && (
            <div>
              <h3 className="text-white font-semibold text-2xl mb-6">API Keys</h3>
              
              <div className="space-y-6">
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">⚠️</span>
                    <h4 className="text-yellow-400 font-medium">Security Warning</h4>
                  </div>
                  <p className="text-yellow-300 text-sm">
                    Keep your API keys secure. Never share them publicly or store them in client-side code.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium text-lg">Active API Keys</h4>
                    <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-colors">
                      Create New Key
                    </button>
                  </div>

                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h5 className="text-white font-medium">Trading API Key</h5>
                        <p className="text-gray-400 text-sm">Created on 2024-01-10</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-sm hover:bg-blue-500/30 transition-colors">
                          Edit
                        </button>
                        <button className="bg-red-500/20 text-red-400 px-3 py-1 rounded text-sm hover:bg-red-500/30 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">API Key</label>
                        <div className="flex items-center space-x-2">
                          <code className="text-white bg-black/50 px-3 py-2 rounded text-sm flex-1 font-mono">
                            ak_live_••••••••••••••••••••••••••••••••
                          </code>
                          <button className="text-purple-400 hover:text-purple-300">📋</button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Permissions</label>
                        <div className="flex space-x-2">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Read</span>
                          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">Trade</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div>
              <h3 className="text-white font-semibold text-2xl mb-6">Notification Settings</h3>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium text-lg">Trading Notifications</h4>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                      <div>
                        <h5 className="text-white font-medium">Order Fills</h5>
                        <p className="text-gray-400 text-sm">Get notified when your orders are executed</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                      <div>
                        <h5 className="text-white font-medium">Price Alerts</h5>
                        <p className="text-gray-400 text-sm">Receive alerts for significant price movements</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                      <div>
                        <h5 className="text-white font-medium">Market News</h5>
                        <p className="text-gray-400 text-sm">Stay updated with the latest market news</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'advanced' && (
            <div>
              <h3 className="text-white font-semibold text-2xl mb-6">Advanced Settings</h3>
              
              <div className="space-y-6">
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">⚠️</span>
                    <h4 className="text-red-400 font-medium">Danger Zone</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-white font-medium">Export Account Data</h5>
                        <p className="text-gray-400 text-sm">Download all your account data</p>
                      </div>
                      <button className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl hover:bg-blue-500/30 transition-colors">
                        Export Data
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-white font-medium">Delete Account</h5>
                        <p className="text-gray-400 text-sm">Permanently delete your account and all data</p>
                      </div>
                      <button className="bg-red-500/20 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Settings
