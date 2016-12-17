(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var { PLAYER_JOINED, WELCOME, WITHDRAW_CARD, TRANSFER_TO_HAND, STARTGAME, WAIT, UPDATE_SERVER, UPDATE_CLIENT, CARDS_MELDED ,WITHDRAW_CARD, SUCCESS} = require('../constants/events')
var socket = io('/game');

initChat(socket);

var uri = window.location.pathname;

var game = {
  gameId : gameId = uri.split("/")[2],
}

var gameJSON
var tempMeldCards = [] //array of ints
const NUM_CARDS_IN_SUIT = 13;

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
  //unbind cards event handler so that the previously attached event handler
  //will not execute before meld state is changed and new event handler
  //is attached by bindEvents()
  $('#PlayerHand div').removeClass('bound');
  $('#PlayerHand div').off();
  
  if($('#meldToggle').attr('value') == 'meld_off') {
    console.log("Turning meld on")
    $('#meldToggle').attr('value', 'meld_on');
    $('#meldToggle').html('Stop Meld');
  }
  else if($('#meldToggle').attr('value') == 'meld_on') {
    console.log("Turning meld off")
    $('#meldToggle').attr('value', 'meld_off');
    $('#meldToggle').html('Start Meld');
    
    //call stop meld
    stopMeldingCards();
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
    
     $('#Deck').removeClass('enabled').addClass('disabled');
     $('#DiscardPile').removeClass('enabled').addClass('disabled');
     $('#PlayerHand').removeClass('disabled').addClass('enabled');
     $('#meldToggle').prop( "disabled", false );
     $('#cancel').prop( "disabled", false );
     
}

const discardCard = (event) => {
  
  if ($('#PlayerHand').hasClass('disabled')) return;
  console.log("Discarding a card");
  var card = $(event.target).attr('cardvalue');
  console.log("TYPE OF:" + typeof card);
  
  //possible bug because card is a string
 if(card >=1 && card <= 52) {
    var indexOfCardToRemove = gameJSON.playerHands[game.playerId].indexOf(parseInt(card));
    console.log('Index of card to remove: ' + indexOfCardToRemove);
    console.log("ARRAY TO STRING:" + gameJSON.playerHands[game.playerId].toString());
  }

  console.log('player ' + game.playerId + ' clicked ' + card);

  //remove from player's hand
  gameJSON.playerHands[game.playerId].splice(indexOfCardToRemove, 1);
  //add to deck
  console.log("DISCARD PILE BEFORE:" + gameJSON.discard_pile.toString());
  gameJSON.discard_pile.push(card);
  console.log("DISCARD PILE AFTER:" + gameJSON.discard_pile.toString());
  
  emitUpdate();
  bindEvents();
}

//not working. make sure toggleMeld is working
const pickMeldCards = (event) => {
  console.log("Picking meld cards");
  
  var card = $(event.target).attr('cardvalue');
  console.log("TYPE OF:" + typeof card);
  
  $('#temp_meld').append("<div id='card"+card+"' cardvalue="+card+" />")
  tempMeldCards.push(parseInt(card));
  
  var indexOfCardToRemove = gameJSON.playerHands[game.playerId].indexOf(parseInt(card)); 
  gameJSON.playerHands[game.playerId].splice(indexOfCardToRemove, 1);

  emitUpdate();
  bindEvents();
  /*var meldObj = {
          playerId : game.playerId,
          cards_melded : meldSet
          }
  */
  
  /*var meldJSON = {
        [melds] = {
          player : game.playerId,
          cards_melded : [1, 2, 3]
          }
  }*/
  
}
  
const stopMeldingCards = () => {
  console.log(tempMeldCards.toString());
  tempMeldCards = tempMeldCards.sort();
  
  if(isLegalMeld(tempMeldCards)) {
    gameJASON.melds.push(tempMeldCards);
  }
  
  socket.emit(CARDS_MELDED, gameJSON);
  
  //var toBeMeldedCards = $('#temp_meld').
  
  //checkLegalMeld() //will check if it is a meld itself, or if it can be melded into
  //already existing meld set (this will take precedence than starting a new meld)
  
  //if legal, update gameJSON meld array (gameUpdate will render meld area automatically)
}

function isLegalMeld(tempMeldCards) {
  var sortedMeldCards = tempMeldCards.sort();
  
  var length = sortedMeldCards.length;
  
  //check if in range
  if(length > 1) {
    if(sortedMeldCards[length-1] >= sortedMeldCards[0]+NUM_CARDS_IN_SUIT) {
      //error not in range
      console.log("Checking Legal Meld: NOT IN RANGE");
      return false;
    }
  }
  
  for(let i = 0; i<length-1; i++) {
    if(!isInOrder(sortedMeldCards[i], sortedMeldCards[i+1])) {
      return false;
    }
  }
  
  return true;
}

function isInOrder(card1, card2) {
  if((card1 == card2+1) || (card1 == card2-1)) {
    return true;
  }
  
  return false;
}

function isSameSuit(card1, card2) {
  
}

function checkLegalLayoff() {
  
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

    if(turn.localeCompare(game.playerId)==0)
    {
        $('#Deck').removeClass('enabled').addClass('disabled');
        $('#DiscardPile').removeClass('enabled').addClass('disabled');
        $('#PlayerHand').removeClass('enabled').addClass('disabled');
        $('#meldToggle').prop( "disabled", true );
        $('#cancel').prop( "disabled", true );
        
        messageText = "Opponent's turn";
    }
    else{
        $('#Deck').removeClass('disabled').addClass('enabled');
        $('#DiscardPile').removeClass('disabled').addClass('enabled');
        $('#PlayerHand').removeClass('enabled').addClass('disabled');
        $('#meldToggle').prop( "disabled", true );
        $('#cancel').prop( "disabled", true );
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

},{"../constants/events":2}],2:[function(require,module,exports){
const PLAYER_JOINED = 'player joined'
const UPDATEGAMELIST = 'update game list'
const STARTGAME = 'start game'
const WITHDRAW_CARD = 'withdraw card'
const WELCOME = 'welcome'
const WAIT = 'wait for other players'
const UPDATE_CLIENT = 'update request client'
const UPDATE_SERVER = 'update request server'
const CARDS_MELDED = 'cards melded'
const UPDATE = 'update request'
const SUCCESS = 'success'

module.exports = { PLAYER_JOINED, UPDATEGAMELIST, STARTGAME, WITHDRAW_CARD, WELCOME, WAIT, UPDATE_CLIENT, UPDATE_SERVER, CARDS_MELDED, UPDATE , SUCCESS}


},{}]},{},[1]);
