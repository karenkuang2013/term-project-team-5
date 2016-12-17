var { PLAYER_JOINED, WELCOME, WITHDRAW_CARD, TRANSFER_TO_HAND, STARTGAME, WAIT, UPDATE_SERVER, UPDATE_CLIENT ,WITHDRAW_CARD, SUCCESS} = require('../constants/events')
var socket = io('/game');

initChat(socket);

var uri = window.location.pathname;

var game = {
  gameId : gameId = uri.split("/")[2],
}

var gameJSON

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
  intializeSocket()

  socket.emit( PLAYER_JOINED, {gameId: game.gameId} )

  socket.on( WELCOME, (data) => {
    game.playerId = data.playerId;
  })

  //intializeSocket()

  socket.on(STARTGAME, (json) => {
    gameJSON = json
    console.log("Game JSON: " + json);
    updateGame(json);
  })

  socket.on(UPDATE_SERVER, updateGame)
  
  socket.on(SUCCESS, success)


})

const bindEvents = () => {
  $('#Deck a:not(.bound)').addClass('bound').on('click', takeDeckCard);
  $('#DiscardPile a:not(.bound)').addClass('bound').on('click', takeDiscardPileCard);

  $('#meldToggle:not(.bound)').addClass('bound').on('click', toggleMeld);

  if($('#meldToggle').attr('value') == 'meld_off') {
    $('#PlayerHand div:not(.bound)').addClass('bound').on('click', discardCard);
  }
  else if($('#meldToggle').attr('value') == 'meld_on') {
    $('#PlayerHand div:not(.bound)').addClass('bound').on('click', pickMeldCards);
  }
}

const toggleMeld = () => {
  if($('#meldToggle').attr('value') == 'meld_off') {
    console.log("Turning meld on")
    $('#meldToggle').attr('value', 'meld_on');
    $('#meldToggle').html('Stop Meld');
  }
  else if($('#meldToggle').attr('value') == 'meld_on') {
    console.log("Turning meld off")
    $('#meldToggle').attr('value', 'meld_off');
    $('#meldToggle').html('Start Meld');
  }

  bindEvents();
}

const takeDiscardPileCard = (event) => {
  if ($('#DiscardPile').hasClass('disabled')) return;

  var card = $(event.target).attr('cardvalue');
  console.log('player ' + game.playerId + ' clicked ' + card);

  var cardId = gameJSON.discard_pile.pop()
    console.log('player ' + game.playerId + ' clicked cardID ' + card);

  gameJSON.playerHands[game.playerId].push(cardId)

  socket.emit(WITHDRAW_CARD, gameJSON)
  bindEvents();
}

const takeDeckCard = (event) => {
  if ($('#Deck').hasClass('disabled')) return;

  var card = $(event.target).attr('cardvalue');
  console.log('player ' + game.playerId + ' clicked ' + card);

  var cardId = gameJSON.deck.pop()
    console.log('player ' + game.playerId + ' clicked cardID ' + card);

  gameJSON.playerHands[game.playerId].push(cardId)

  socket.emit(WITHDRAW_CARD, gameJSON)
  bindEvents();
}

const success = (json) => {
    
    
}

const discardCard = (event) => {
  console.log("Discarding a card");
  var card = $(event.target).attr('cardvalue');
  console.log("TYPE OF:" + typeof card);


  if(card >=1 && card <= 52) {
    var indexOfCardToRemove = gameJSON.playerHands[game.playerId].indexOf(parseInt(card));
    console.log('Index of card to remove: ' + indexOfCardToRemove);
    console.log("ARRAY TO STRING:" + gameJSON.playerHands[game.playerId].toString());
  }

  console.log('player ' + game.playerId + ' clicked ' + card);

  //remove from player's hand
  gameJSON.playerHands[game.playerId].splice(indexOfCardToRemove, 1);
  //add to deck
  gameJSON.discard_pile.push(card);

  emitUpdate();
  bindEvents();
}

//not working. make sure toggleMeld is working
const pickMeldCards = () => {
  console.log("Picking meld cards");
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
        $('#Deck').removeClass('enabled').addClass('disabled');
        $('#DiscardPile').removeClass('enabled').addClass('disabled');
        $('#PlayerHand').removeClass('enabled').addClass('disabled');
        $('#PlayerHand').removeClass('enabled').addClass('disabled');
        
        messageText = "Opponent's turn";
    }
    else{
        $('#Deck').removeClass('disabled').addClass('enabled');
        $('#DiscardPile').removeClass('disabled').addClass('enabled');
        $('#PlayerHand').removeClass('enabled').addClass('disabled');
        $('#PlayerHand').removeClass('enabled').addClass('disabled');
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
