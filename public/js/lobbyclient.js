//var chat = require('chat');
var socket = io('/lobby');
initChat(socket);

$(document).ready(function() {
  initVariables();
  initBindEvents();
  listenSocketEvents();
  
  addLogout();
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

function initVariables() {
  $doc = $(document);
  $gameList = $('#gameList');
}

function initBindEvents() {
  $doc.on('click', '#new-game-btn', createNewGame);
  $doc.on('click', 'button[name=joinGameButton]', joinGame);
};

function listenSocketEvents() {
  socket.on('update game list', updateGameList);
  socket.on('user_entered_lobby', sendChatUserMessage);
  socket.on('user_left_lobby', sendChatUserMessage);
};

function createNewGame() {
  console.log("CREATING NEW GAME");
  var pathname = window.location.origin + "/game/createGame";
  console.log("PATHNAME:" + pathname);
  window.location.replace(pathname);
};

function joinGame(){
  console.log('in joingame');
  gameId = $(this).attr("value");
  var pathname = window.location.origin + "/game/joinGame/" + gameId;
  window.location.replace(pathname);
}

function updateGameList(gameIds) {
  console.log('in udpateGameList()');
  console.log(gameIds);
  let html ='';
  for(i=0; i<gameIds.length; i++){
    html = html + '<li class="list-group-item"><button class="btn btn-default" name="joinGameButton" value="'+gameIds[i]+'">' + gameIds[i] + '</button></li>';
  }
  $gameList.html(html);
}

function sendChatUserMessage(message) {
  var liNode, liText, ulMessages, chat_box;

  chat_box = document.getElementById("chat-box");
  ulMessages = document.getElementById("messages");

  liNode = document.createElement("LI");
  liText = document.createTextNode(message);
  liNode.setAttribute("style", "font-style: italic");
  liNode.appendChild(liText);

  ulMessages.appendChild(liNode);
    
  chat_box.scrollTop = chat_box.scrollHeight; //scrolls chat down
}
