var socket;

$(document).ready(function () {
  $('.submit_on_enter').keydown(function(event) {
    // enter has keyCode = 13, change it if you want to use another button
    if (event.keyCode == 13) {
	    event.preventDefault();
      sendMessage();

      return false;
    }
  });
  
  
  socket.on('chat_received', function(msg) {
    var liNode, liText, ulMessages, chat_box;
    console.log("Called once: " + msg);

    chat_box = document.getElementById("chat-box");
    ulMessages = document.getElementById("messages");

    liNode = document.createElement("LI");
    liText = document.createTextNode(msg);
    liNode.appendChild(liText);

    ulMessages.appendChild(liNode);
    
    chat_box.scrollTop = chat_box.scrollHeight; //scrolls chat down
  });

});

function initChat(inputSocket) {
  socket = inputSocket;

/*   socket.on('chat_received', function(msg) {
    var liNode, liText, ulMessages, chat_box;
    console.log("Called once: " + msg);

    chat_box = document.getElementById("chat-box");
    ulMessages = document.getElementById("messages");

    liNode = document.createElement("LI");
    liText = document.createTextNode(msg);
    liNode.appendChild(liText);

    ulMessages.appendChild(liNode);
    
    chat_box.scrollTop = chat_box.scrollHeight; //scrolls chat down
  });*/
};

function sendMessage() {
  var message = document.getElementById("chat-input").value;

  //add username to message
	message = document.getElementById("target").value + " " + message;
  document.getElementById("chat-input").value = "";
  
  socket.emit('chat_sent', message);
}
