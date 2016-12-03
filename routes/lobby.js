module.exports = function(io) {
  let express = require('express');
  let router = express.Router();
  let username;
  let session;
  router.use(express.static('public', {'root': './'}))

  /* GET home page. */
  router.get('/', function(req, res, next) {
    session = req.session;
    
    if(session.user) {
      username = session.user;
      res.render('lobby', { usern: JSON.stringify(username) });
    }
  });

  router.post('/', function(request, response, next) {
    username  = req.body.username;
    res.render('lobby', { usern: JSON.stringify(username) });
  });

  io.on('connection', function(socket) {
    console.log("A user connected to /");
    socket.on('chat_sent', function(message){
      username = message.substr(0,message.indexOf(' '));
      message = message.substr(message.indexOf(' ')+1);
      io.sockets.emit('chat_received', username + ": " + message);
    });
    socket.on('disconnect', function() {
      console.log("user disconnected from /");
    });

  });

  let io_lobby = io.of('lobby');

  io_lobby.on('connection', function(socket) {
    console.log("A user connected to the /lobby namespace");

    socket.on('disconnect', function() {
      console.log("user disconnected from /lobby namespace");
    });

    socket.on('chat_sent', function(message) {
      console.log("message: " + message);
      io_lobby.emit('chat_received', "Socket id(" + socket.id + "): " + message);
    });
  });


  return router;
}
