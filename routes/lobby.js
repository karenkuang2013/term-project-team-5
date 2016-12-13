module.exports = function(db, io) {
  let express = require('express');
  let router = express.Router();
  let username;
  let session;
  const dbjs = require('./database')
  const database = new dbjs(db)
  const { UPDATEGAMELIST } = require('../constants/events')
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
    console.log("A user connected to /");
    socket.on('disconnect', function() {
    console.log("user disconnected from /");
    });
  });

  var lobby_io = io.of('/lobby');
  console.log("namespace: " + lobby_io);
  
  lobby_io.on('connection', function(socket) {
    console.log("A user connected to /lobby namespace");
    
    require('./gameserver').broadcastGameList(lobby_io);
    lobby_io.emit("user_entered_lobby", "User " + username + " has entered the room...");
    
    socket.on('chat_sent', function(message) {
     username = message.substr(0,message.indexOf(' '));
     message = message.substr(message.indexOf(' ')+1);

      lobby_io.emit('chat_received', username + ": " + message);
    });

    socket.on('disconnect', function() {
      console.log("user disconnected from /lobby namespace");
      lobby_io.emit("user_left_lobby", "User " + username + " has left the room...");
    });
  });

  const broadcastGameList = (socket) => {
    database.getAvailableGames()
    .then ( (listGameIds) => {
      console.log(listGameIds);
      socket.emit( UPDATEGAMELIST, listGameIds )
    })
  }

  return router;
}
