module.exports = function(db, io) {

  const express = require('express')
  const router = express.Router()
  const path = require('path')
  const rummy = require('./rummyserver')

  router.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'html/game.html'))
  })

  io.on('connection', function(socket){
    rummy.initGame (io, socket, db)
  })

  return router

}
