module.exports = function(db, io) {

  const express = require('express')
  const router = express.Router()

  const path = require('path')
  const shuffle = require('knuth-shuffle').knuthShuffle
  const dbjs = require('./database')
  const database = new dbjs(db)

  const { PLAYER_JOINED, WELCOME, WITHDRAW_CARD, TRANSFER_TO_HAND, WAIT, STARTGAME, UPDATEGAMELIST, UPDATE_SERVER, UPDATE_CLIENT }
    = require('../constants/events')

  const gameServer = require('./gameserver')
  gameServer.init(db, io)

  let playerId

  /* Route for create Game */
  router.get( '/createGame', ( request, response ) => {
    console.log(request.session.player_id + ' requested new game')

    gameId = generateRandomGameId()
    database.createGame(gameId)
    .then ((result) => {
      database.createGamePlayer(gameId, request.session.player_id)
      .then (() => {
        broadcastGameList()
        response.redirect('/game/' + gameId)
      })
    })

  })

  /* Route for join Game */
  router.get('/joinGame/:gameId', (req, resp) => {

    gameId = req.params.gameId
    database.createGamePlayer(gameId, req.session.player_id)
    resp.redirect('/game/'+gameId)

  })

  /* Route for game room */
  router.get('/:gameId', (req, resp) => {

    gameId = req.params.gameId
    playerId = req.session.player_id
    resp.render('game_rajat', { username: req.session.username, playerId: req.session.player_id, gameId: gameId})

  })

  const generateRandomGameId = () => {
    return ( Math.random() * 100000 ) | 0
  }

  const broadcastGameList = () => {
    database.getAvailableGames()
    .then ( (listGameIds) => {
      console.log(listGameIds);
      io.of('/lobby').emit( UPDATEGAMELIST, listGameIds )
    })

  }




  /* Socket Operations */
  const game_io = io.of('/game')
  game_io.on('connection', function(socket) {

    socket.emit(WELCOME, {playerId: playerId})

    const newPlayerJoined = (data) => {
      socket.join(data.gameId.toString())

      let playerCount = io.nsps['/game'].adapter.rooms[gameId.toString()].length

      if(playerCount==2) {
        initialiseCardsJSON(gameId)
        .then ((gameJSON) => {
          game_io.to(data.gameId.toString()).emit( STARTGAME, gameJSON )
        })

        broadcastGameList()
      }
      else {
        game_io.to(data.gameId.toString()).emit( WAIT, {msg : 'Please wait'} )
      }
    }

    const initialiseCardsJSON = (gameId) => {

      return database.getGamePlayer(gameId)
      .then((players) => {

        cards = [ 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,
          24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,
          47,48,49,50,51,52]

        cardsShuffled = shuffle(cards.slice(0))
        deckArray = cardsShuffled.slice(0,31)
        dicardPileArray = cardsShuffled.slice(31,32)
        player1HandArray = cardsShuffled.slice(32,42)
        player2HandArray = cardsShuffled.slice(42,52)

        json = {
          gameId : gameId,
          deck : deckArray,
          discard_pile : dicardPileArray,
          playerHands : {
            [players[0].player_id]  : player1HandArray,
            [players[1].player_id]  : player2HandArray
          },
          turn : players[0].player_id
        }
        database.addGameStateToDb(json, true)
        return json
      });

    }

    const updateGame = (json) => {

      game_io.to(json.gameId.toString()).emit( UPDATE_SERVER, json )

    }

      /*New player joined /game */
      socket.on(PLAYER_JOINED, newPlayerJoined)
      socket.on(UPDATE_CLIENT, updateGame)

      socket.on('disconnect', () => {
        console.log("user disconnected from /game namespace");
        if(typeof gameId != 'undefined') {
          database.updateAvailableGames(gameId)
          .then (() => {
            broadcastGameList()
          })
        }

      });

      socket.on('chat_sent', function(message){
        username = message.substr(0, message.indexOf(' '));
        message = message.substr(message.indexOf(' ')+1);

        game_io.to(gameId).emit('chat_received', username + ": " + message);
      });

});

      /*
      socket.on(WITHDRAW_CARD, (data) => {
      console.log('player '+data.game.playerId+' clicked '+data.cardId)

      gameJSON.player.push(data.cardId)
      gameJSON.deck.pop()
      // console.log(gameJSON);
      socket.emit(TRANSFER_TO_HAND, gameJSON)
    })

*/

return router
}
