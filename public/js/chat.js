var socket;

function initChat(inputSocket) {
  socket = inputSocket;
  $('.submit_on_enter').keydown(function(event) {
    // enter has keyCode = 13, change it if you want to use another button
    if (event.keyCode == 13) {
	    event.preventDefault();
      sendMessage();

      return false;
    }
  });

  socket.on('chat_received', function(msg) {
    var liNode, liText, ulMessages;
    console.log("Called once: " + msg);

    liNode = document.createElement("LI");
    liText = document.createTextNode(msg);

    liNode.appendChild(liText);

    ulMessages = document.getElementById("messages");
    ulMessages.appendChild(liNode);
  });

};

function sendMessage() {
  var message = document.getElementById("chat-input").value;

  //add username to message
	message = document.getElementById("target").value + " " + message;
  document.getElementById("chat-input").value = "";

  socket.emit('chat_sent', message);
}
