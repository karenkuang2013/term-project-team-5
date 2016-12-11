var uri = window.location.pathname;
var gameId = uri.split("/")[2];

var socket = io('/game');
initChat(socket);

$(document).ready(function() {
  addLogout();
  
  socket.emit('player joined', {gameId: gameId});

  socket.on('start game', (data) => {
    console.log(data.msg);
  });

});

function addLogout() {
  var navBar = document.getElementById("menu");
  
  liNode = document.createElement("LI");
  liAnchor = document.createElement("a");
  liAnchor.href = "/logout";
  liAnchor.text = "Logout";
  liNode.appendChild(liAnchor);

  navBar.appendChild(liNode);
}
