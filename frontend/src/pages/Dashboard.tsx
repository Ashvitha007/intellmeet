import { useState, useEffect } from 'react'
import axios from 'axios'
import ChatBox from '../components/ChatBox'

const Dashboard = ({ onJoinMeeting }: { onJoinMeeting: (code: string, name: string) => void }) => {
  const [meetings, setMeetings] = useState([])
  const [title, setTitle] = useState('')
  const [user, setUser] = useState<any>(null)
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null)

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchMeetings()
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchMeetings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/meetings', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMeetings(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const createMeeting = async () => {
    try {
      await axios.post('http://localhost:5000/api/meetings',
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTitle('')
      fetchMeetings()
      alert('Meeting Created! 🎉')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div style={{ padding: '20px', background: '#16213e', minHeight: '100vh', color: 'white' }}>
      <h1>🤖 IntellMeet Dashboard</h1>
      {user && <p>Welcome, <b>{user.name}</b>! 👋</p>}

      <div style={{ background: '#1a1a2e', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3>Create New Meeting</h3>
        <input
          type="text"
          placeholder="Meeting Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '5px', border: 'none', marginRight: '10px' }}
        />
        <button
          onClick={createMeeting}
          style={{ padding: '10px 20px', background: '#e94560', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Create Meeting
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ background: '#1a1a2e', padding: '20px', borderRadius: '10px', flex: 1 }}>
          <h3>My Meetings ({meetings.length})</h3>
          {meetings.length === 0 ? (
            <p>No meetings yet. Create one! 🚀</p>
          ) : (
            meetings.map((meeting: any) => (
              <div
                key={meeting._id}
                onClick={() => setSelectedMeeting(meeting)}
                style={{ background: selectedMeeting?._id === meeting._id ? '#e94560' : '#0f3460', padding: '15px', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer' }}
              >
                <h4>📅 {meeting.title}</h4>
                <p>Code: <b>{meeting.meetingCode}</b></p>
                <p>Status: {meeting.status}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); onJoinMeeting(meeting.meetingCode, user?.name) }}
                  style={{ padding: '8px 15px', background: '#e94560', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '5px' }}
                >
                  Join Meeting 🚀
                </button>
              </div>
            ))
          )}
        </div>

        {selectedMeeting && user && (
          <ChatBox
            meetingCode={selectedMeeting.meetingCode}
            userName={user.name}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard