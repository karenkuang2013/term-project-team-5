let io
let listGameIds = []
const { UPDATEGAMELIST } = require('../constants/events')
const shuffle = require('knuth-shuffle').knuthShuffle
const dbjs = require('./database')
let database

function init(sdb, sio) {
  io = sio
  database = new dbjs(sdb)
}

function generateRandomGameId() {
  return ( Math.random() * 100000 ) | 0
}

function createNewGame() {

  gameId = generateRandomGameId()
  addGame(gameId)
  broadcastGameList(io)
  database.createGame(gameId)
  .then((data) => {
     database.createGamePlayer(data.game_id, playerId )
  })

  return gameId
}

function joinGame(gameId) {

  let playerCount = io.sockets.adapter.rooms[gameId.toString()].length

  if(playerCount==1) {
    io.to(data.gameId.toString()).emit('room full', data.gameId)
    startgame(data.gameId);
  }
}

function broadcastGameList(sio) {
  sio.emit( UPDATEGAMELIST, listGameIds )
 }


function addGame(gameId) {
  // database.createGame(gameId)
  listGameIds.push(gameId)
}


module.exports = { init, broadcastGameList, addGame, createNewGame, joinGame }
