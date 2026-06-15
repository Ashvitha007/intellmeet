const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join Meeting Room
    socket.on('join-meeting', (meetingCode) => {
      socket.join(meetingCode);
      console.log(`User joined meeting: ${meetingCode}`);
      io.to(meetingCode).emit('user-joined', {
        socketId: socket.id,
        message: 'A new user joined the meeting!'
      });
    });

    // Send Message
    socket.on('send-message', ({ meetingCode, message, userName }) => {
      io.to(meetingCode).emit('receive-message', {
        message,
        userName,
        time: new Date().toISOString()
      });
    });

    // Leave Meeting
    socket.on('leave-meeting', (meetingCode) => {
      socket.leave(meetingCode);
      io.to(meetingCode).emit('user-left', {
        socketId: socket.id,
        message: 'A user left the meeting!'
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;