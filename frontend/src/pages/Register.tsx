import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password
      })
      localStorage.setItem('token', res.data.token)
      alert('Register Success! 🎉')
    } catch (err) {
      setError('Registration failed!')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ background: '#1a1a2e', padding: '40px', borderRadius: '10px', width: '400px' }}>
        <h2 style={{ color: 'white', textAlign: 'center' }}>🤖 IntellMeet Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }}
          />
          <button
            type="submit"
            style={{ width: '100%', padding: '10px', background: '#0f3460', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register