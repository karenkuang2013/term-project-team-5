let io
let database
let listGameIds = []
const { UPDATEGAMELIST } = require('../constants/events')

function init(sdb, sio) {
  database = require('./database')(sdb)
  io = sio
}

function generateRandomGameId() {
  return ( Math.random() * 100000 ) | 0
}

function createNewGame() {

  gameId = generateRandomGameId()
  addGame(gameId)
  broadcastGameList(io)

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

function checkGamePlayerCount(socket, gameId) {
  let playerCount = io.nsps['/game'].adapter.rooms[gameId.toString()].length

  if(playerCount == 2) {
    io.to(gameId.toString()).emit('start game', { msg: "wuhoo" })
    // startgame(data.gameId);
  }

}

module.exports = { init, broadcastGameList, addGame, createNewGame, joinGame, checkGamePlayerCount }
