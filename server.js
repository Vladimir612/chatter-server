const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 5000
const io = require('socket.io')(PORT)
const app = express()
app.use(cors())

io.on('connection', (socket) => {
  const id = socket.handshake.query.id
  socket.join(id) //this allows us to use same id consistently

  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r !== recipient)
      //line 9 is removing current recipient from recipients

      newRecipients.push(id) //this is adding the sender from before to recipients

      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients,
        sender: id,
        text,
      })
    })
  })
})
