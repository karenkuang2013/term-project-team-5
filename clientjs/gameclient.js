var { PLAYER_JOINED, WELCOME, WITHDRAW_CARD, TRANSFER_TO_HAND, STARTGAME, WAIT } = require('../constants/events')
var socket = io('/game');

initChat(socket);

var uri = window.location.pathname;

var game = {
  gameId : gameId = uri.split("/")[2],
}

const intializeSocket = () => {
  socket.on( WAIT, displayWait )
}

const displayWait = (data) => {
  console.log('displayWait');
  // $('#gameArea').hide()
}


$(document).ready(function() {

  addLogout()
  bindEvents()
  intializeSocket()

  socket.emit( PLAYER_JOINED, {gameId: game.gameId} )

  socket.on( WELCOME, (data) => {
    game.playerId = data.playerId;
  })

  socket.on(STARTGAME, (json) => {
    console.log(json);
    updateGame(json);
  })

  socket.on(TRANSFER_TO_HAND, (data) => {

    updateGame(data);

  })

})


const bindEvents = () => {
  // $('#Deck a').on('click', transferCard)
}

const transferCard = (e) => {
  var card = $(e.target).attr('cardvalue');
  console.log('player '+game.playerId+' clicked '+card);
  socket.emit(WITHDRAW_CARD, {game: game, cardId: card})
}

const updateGame = (json) => {
  var playerHand = ""
  var opponentHand = ""
  console.log(json.playerHands[game.playerId]);

  var players = Object.keys(json.playerHands)

  players.forEach((p) => {
    if(p.localeCompare(game.playerId)==0){
      json.playerHands[p].forEach((value)=> {
        playerHand = playerHand + "<div id='card"+value+"' cardvalue="+value+" />";
      })
      $('#PlayerHand').html(playerHand)
    }
    else {
      json.playerHands[p].forEach((value)=> {
        opponentHand = opponentHand + "<div id='card53' />";
      })
      $('#OpponentHand').html(opponentHand)
    }
  })

  var deck = ""
  deck = "<a><div id='card53' cardvalue="+json.deck[json.deck.length-1]+" /></a>";
  console.log(deck);

  $('#Deck').html(deck)

  bindEvents();

}

function addLogout() {
  var navBar = document.getElementById("menu");

  liNode = document.createElement("LI");
  liAnchor = document.createElement("a");
  liAnchor.href = "/logout";
  liAnchor.text = "Logout";
  liNode.appendChild(liAnchor);

  navBar.appendChild(liNode);
}
