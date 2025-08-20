import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", email: "", password: "" })
  const [image, setImage] = useState(null)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("username", form.username)
      formData.append("email", form.email)
      formData.append("password", form.password)
      if (image) formData.append("image", image)
      const res = await axios.post("http://localhost:8000/api/register/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      alert("Registration successful!")
      // Store token and user info
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      navigate("/dashboard")
    } catch (error) {
      console.log("Registration error:", error)
      alert("Error: " + (error.response?.data?.error || "Try again"))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input className="w-full p-2 mb-2 border" name="username" placeholder="Username" onChange={handleChange} required />
        <input className="w-full p-2 mb-2 border" name="email" placeholder="Email" type="email" onChange={handleChange} required />
        <input className="w-full p-2 mb-2 border" name="password" placeholder="Password" type="password" onChange={handleChange} required />
        <input className="w-full p-2 mb-4 border" name="image" type="file" accept="image/*" onChange={handleImageChange} />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
      <a href="/" className="block text-center mt-4 text-blue-600 hover:underline">Already have an account? Login</a>
      </form>
    </div>
  )
}

export default Register
