var socket = io('/game');
initChat(socket);

var uri = window.location.pathname;
var gameId = uri.split("/")[2];

$(document).ready(function() {

  socket.emit('player joined', {gameId: gameId});

  socket.on('start game', (data) => {
    console.log(data.msg);
  });

});
