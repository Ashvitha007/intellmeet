import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MeetingRoom from './pages/MeetingRoom'

function App() {
  const [page, setPage] = useState('login')
  const [meetingCode, setMeetingCode] = useState('')
  const [userName, setUserName] = useState('')

  const joinMeeting = (code: string, name: string) => {
    setMeetingCode(code)
    setUserName(name)
    setPage('meeting')
  }

  return (
    <div>
      {page !== 'meeting' && (
        <div style={{ textAlign: 'center', padding: '10px', background: '#0f3460' }}>
          <button
            onClick={() => setPage('login')}
            style={{ margin: '5px', padding: '8px 20px', cursor: 'pointer', background: page === 'login' ? '#e94560' : 'white', color: page === 'login' ? 'white' : 'black', border: 'none', borderRadius: '5px' }}
          >
            Login
          </button>
          <button
            onClick={() => setPage('register')}
            style={{ margin: '5px', padding: '8px 20px', cursor: 'pointer', background: page === 'register' ? '#e94560' : 'white', color: page === 'register' ? 'white' : 'black', border: 'none', borderRadius: '5px' }}
          >
            Register
          </button>
          <button
            onClick={() => setPage('dashboard')}
            style={{ margin: '5px', padding: '8px 20px', cursor: 'pointer', background: page === 'dashboard' ? '#e94560' : 'white', color: page === 'dashboard' ? 'white' : 'black', border: 'none', borderRadius: '5px' }}
          >
            Dashboard
          </button>
        </div>
      )}
      {page === 'login' && <Login />}
      {page === 'register' && <Register />}
      {page === 'dashboard' && <Dashboard onJoinMeeting={joinMeeting} />}
      {page === 'meeting' && <MeetingRoom meetingCode={meetingCode} userName={userName} />}
    </div>
  )
}

export default App