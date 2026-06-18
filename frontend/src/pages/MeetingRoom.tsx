import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:5000')

const MeetingRoom = ({ meetingCode, userName }: { meetingCode: string, userName: string }) => {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [isSharing, setIsSharing] = useState(false)
  const [participants, setParticipants] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const screenRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    socket.emit('join-meeting', meetingCode)

    socket.on('receive-message', (data: any) => {
      setMessages(prev => [...prev, data])
    })

    socket.on('user-joined', (data: any) => {
      setMessages(prev => [...prev, {
        userName: 'System',
        message: data.message,
        time: new Date().toISOString()
      }])
      setParticipants(prev => [...prev, data.socketId])
    })

    // Start camera
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch(err => console.log('Camera error:', err))

    return () => {
      socket.emit('leave-meeting', meetingCode)
      socket.off('receive-message')
      socket.off('user-joined')
    }
  }, [meetingCode])

  const sendMessage = () => {
    if (!input.trim()) return
    socket.emit('send-message', { meetingCode, message: input, userName })
    setInput('')
  }

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      if (screenRef.current) {
        screenRef.current.srcObject = stream
        setIsSharing(true)
      }
    } catch (err) {
      console.log('Screen share error:', err)
    }
  }

  const stopScreenShare = () => {
    if (screenRef.current && screenRef.current.srcObject) {
      const tracks = (screenRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      screenRef.current.srcObject = null
      setIsSharing(false)
    }
  }

  return (
    <div style={{ background: '#16213e', minHeight: '100vh', color: 'white', padding: '20px' }}>
      <h2>🤖 Meeting Room — {meetingCode}</h2>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Video Section */}
        <div style={{ flex: 1 }}>
          <h3>📹 My Camera</h3>
          <video ref={videoRef} autoPlay muted style={{ width: '100%', borderRadius: '10px', background: '#000' }} />

          {isSharing && (
            <>
              <h3>🖥️ Screen Share</h3>
              <video ref={screenRef} autoPlay style={{ width: '100%', borderRadius: '10px', background: '#000' }} />
            </>
          )}

          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button
              onClick={isSharing ? stopScreenShare : startScreenShare}
              style={{ padding: '10px 20px', background: isSharing ? '#e94560' : '#0f3460', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              {isSharing ? '⏹ Stop Share' : '🖥️ Share Screen'}
            </button>
          </div>
        </div>

        {/* Chat Section */}
        <div style={{ width: '300px' }}>
          <h3>💬 Chat</h3>
          <div style={{ height: '300px', overflowY: 'auto', background: '#0f3460', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <b style={{ color: '#e94560' }}>{msg.userName}:</b>
                <span> {msg.message}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type message..."
              style={{ flex: 1, padding: '8px', borderRadius: '5px', border: 'none', marginRight: '5px' }}
            />
            <button
              onClick={sendMessage}
              style={{ padding: '8px 15px', background: '#e94560', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeetingRoom