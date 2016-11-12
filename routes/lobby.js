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
        console.log("A user connected to the /lobby namespace");
    
        socket.on('disconnect', function() {
            console.log("user disconnected from /chat namespace");
        });
    });
    
    return router;
}
/*
var io_lobby = io.of('/chat');

io_lobby.on('connection', function(socket) {
    console.log("A user connected to the /chat namespace");
    
    socket.on('disconnect', function() {
        console.log("user disconnected from /chat namespace");
    });
});
*/
//module.exports = router;
