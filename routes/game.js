module.exports = function(db, io) {

  const express = require('express');
  const router = express.Router();
  const path = require('path');
  const gameServer = require('./gameserver')
  const database = require('./database')(db)

  let gameId;
  let session;
  let username;
  let playerId;

  function init(req) {
    session = req.session;
    username = session.user;
    playerId = session.player_id;

    gameServer.init(db, io)
  }

  router.get('/createGame', (req, resp) => {

    init(req)
    gameId = gameServer.createNewGame()
    console.log(playerId + ' requested new game')
    resp.redirect('/game/'+gameId)
  })

  router.get('/joinGame/:gameId', (req, resp) => {

    init(req)
    gameId = req.params.gameId
    gameServer.joinGame(gameId)
    resp.redirect('/game/'+gameId)

  })

  router.get('/:gameId', (req, resp) => {

    init(req)
    gameId = req.params.gameId
    resp.render('game', { USERNAME: username, gameId: gameId })

  })

  const game_io = io.of('/game');
  game_io.on('connection', function(socket) {
    socket.join(gameId); //check for undefined
    console.log("A user connected to /game namespace, room " + gameId);

    socket.on('player joined', (data) => {
      socket.join(data.gameId.toString())
      gameServer.checkGamePlayerCount(socket, gameId)
    })

    socket.on('chat_sent', function(message){
      username = message.substr(0, message.indexOf(' '));
      message = message.substr(message.indexOf(' ')+1);

      game_io.to(gameId).emit('chat_received', username + ": " + message);
    });

    socket.on('disconnect', function() {
      console.log("user disconnected from /game namespace");
    });

  });

  return router
}
