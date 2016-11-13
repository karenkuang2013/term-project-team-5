module.exports = function(io) {  
    var express = require('express');
    var router = express.Router();

    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('lobby', {});
    });

    router.post('/', function(request, response, next) {
        response.render('lobby', { text: "A post request was sent"});
    });
    
    io.on('connection', function(socket) {
        console.log("A user connected to /");
    
        socket.on('disconnect', function() {
            console.log("user disconnected from /");
        });
    });
    
    var io_lobby = io.of('lobby');
    
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