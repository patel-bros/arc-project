import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", password: "" })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:8000/api/login/", form)
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      navigate("/dashboard")
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.error || "Try again"))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input className="w-full p-2 mb-2 border" name="username" placeholder="Username" onChange={handleChange} required />
        <input className="w-full p-2 mb-4 border" name="password" placeholder="Password" type="password" onChange={handleChange} required />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
        <a href="/register" className="block text-center mt-4 text-blue-600 hover:underline">Don't have an account? Register</a>
      </form>
    </div>
  )
}

export default Login
