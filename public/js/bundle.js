(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../constants/events":2}],2:[function(require,module,exports){
const PLAYER_JOINED = 'player joined'
const UPDATEGAMELIST = 'update game list'
const STARTGAME = 'start game'
const WITHDRAW_CARD = 'withdraw card'
const WELCOME = 'welcome'
const TRANSFER_TO_HAND = 'transfer to player hand'
const WAIT = 'wait for other players'

module.exports = { PLAYER_JOINED, UPDATEGAMELIST, STARTGAME, WITHDRAW_CARD, WELCOME, TRANSFER_TO_HAND, WAIT }

},{}]},{},[1]);
