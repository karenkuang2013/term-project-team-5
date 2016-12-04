module.exports = function(io) {
  let express = require('express');
  let router = express.Router();
  let username;
  let session;
  router.use(express.static('public', {'root': './'}))

  /* GET home page. */
  router.get('/', function(request, response, next) {
    session = request.session;
    
    if(session.user) {
      username = session.user;
      response.render('lobby', { USERNAME: username });
    }
  });
  
  router.post('/', function(request, response, next) {
    username  = request.body.username;
    
    response.render('lobby', { USERNAME: username });
  });
  
  io.on('connection', function(socket) {
    socket.join('lobby');
    console.log("A user connected to /lobby room");
    
    socket.on('chat_sent', function(message){
      username = message.substr(0,message.indexOf(' '));
      message = message.substr(message.indexOf(' ')+1);
      
      //io.sockets.emit('chat_received', username + ": " + message);
      io.to('lobby').emit('chat_received', username + ": " + message);
    });
    
    socket.on('disconnect', function() {
      console.log("user disconnected from /");
    });

  });
  
  return router;
}
