const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const messageSchema = new Schema({
  content: {type: String}
})
const MessageModel = mongoose.model("Message", messageSchema)
app.get('/', (req, res) => {

  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

server.listen(3000, async function(){
  await mongoose.connect("mongodb+srv://asazerk:hello@cluster0.d5x2p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  console.log('listening on *:3000');
});
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
    });
  });

  io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      const message = new MessageModel();
      message.content = msg;
      message.save().then(m => {
        console.log(m)
        io.emit('chat message', msg);
      })
    });
  });
  //mongodb+srv://asazerk:<helloWorld>@cluster0.d5x2p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0