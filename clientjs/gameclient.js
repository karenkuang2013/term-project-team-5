var { PLAYER_JOINED, WELCOME, WITHDRAW_CARD, TRANSFER_TO_HAND, STARTGAME, WAIT, UPDATE_SERVER, UPDATE_CLIENT } = require('../constants/events')
var socket = io('/game');

initChat(socket);

var uri = window.location.pathname;

var game = {
  gameId : gameId = uri.split("/")[2],
}

var gameJSON
var meldOff = true;

const intializeSocket = () => {
  socket.on( WAIT, displayWait )
}

const displayWait = (data) => {
 $('#gameArea').hide();
 var form = document.getElementById("waitingArea");
 var alertDiv = document.createElement("DIV");
 var alertText = document.createTextNode("Welcome !\n Waiting for other player to join.");
 alertDiv.classList.add("alert","alert-danger", "text-center");
 alertDiv.setAttribute("role", "alert");
 alertDiv.appendChild(alertText);
 form.appendChild(alertDiv);
}


$(document).ready(function() {

  addLogout()
  bindEvents()

  socket.emit( PLAYER_JOINED, {gameId: game.gameId} )

  socket.on( WELCOME, (data) => {
    game.playerId = data.playerId;
  })
  
  intializeSocket()
  
  socket.on(STARTGAME, (json) => {
    gameJSON = json
    console.log("Game JSON: " + json);
    updateGame(json);
  })

  socket.on(UPDATE_SERVER, updateGame)

  // socket.on(TRANSFER_TO_HAND, (data) => {
  //
  //   updateGame(data);
  //
  // })

})


const bindEvents = () => {
  $('#Deck a').on('click', takeDeckCard)
  $('#meldToggle').on('click', toggleMeld)
  
  if(meldOff) {
    $('#PlayerHand div').on('click', discardCard)
  }
  else {
    $('#PlayerHand div').on('click', pickMeldCards)
  }
}

const discardCard = () => {
  console.log("Discarding a card");
}

//not owrking. make sure toggleMeld is working
const pickMeldCards = () => {
  console.log("Picking meld cards");
}

const toggleMeld = () => {
  meldOff ? meldOff = false : meldOff = true;
  
  if(meldOff) {
    $('#meldToggle').html("Start Meld");
  }
  else {
    $('#meldToggle').html("Stop Meld");
  }
    
}

const takeDeckCard = (e) => {
  if ($('#Deck').hasClass('disabled')) return;
  
  var card = $(e.target).attr('cardvalue');
  console.log('player '+game.playerId+' clicked '+card);

  var cardId = gameJSON.deck.pop()
  gameJSON.playerHands[game.playerId].push(cardId)


  emitUpdate();
  bindEvents();
}

const emitUpdate = () => {
  socket.emit(UPDATE_CLIENT, gameJSON)
}

const updateGame = (json) => {

  $('#gameArea').show();
  $('#waitingArea').hide();
  gameJSON = json
  var playerHand = ""
  var opponentHand = ""

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
  $('#Deck').html(deck)

  var discardPile = ""
  discardPile = "<a><div id='card"+json.discard_pile[0]+"' cardvalue="+json.discard_pile[0]+" /></a>";
  $('#DiscardPile').html(discardPile)
 
  checkTurn(json.turn.toString());
  bindEvents();

}
const checkTurn = (turn) => {
    var messageBar = document.getElementById("Message");
    var messageText = '';

    if(turn != game.playerId)
    {
        $('#Deck').addClass('disabled');
        messageText = "Opponent's turn";
    }
    else{
        
        $('#Deck').addClass('enabled');
        messageText = "Your Turn";
    }
    messageBar.innerHTML = messageText;
   
     
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
