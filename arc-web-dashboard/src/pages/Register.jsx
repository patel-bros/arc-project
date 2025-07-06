import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", email: "", password: "" })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:8000/api/register/", form)
      alert("Registration successful!")
      navigate("/")
    } catch (error) {
      alert("Error: " + error.response?.data?.email || "Try again")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input className="w-full p-2 mb-2 border" name="username" placeholder="Username" onChange={handleChange} required />
        <input className="w-full p-2 mb-2 border" name="email" placeholder="Email" type="email" onChange={handleChange} required />
        <input className="w-full p-2 mb-4 border" name="password" placeholder="Password" type="password" onChange={handleChange} required />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  )
}

export default Register
