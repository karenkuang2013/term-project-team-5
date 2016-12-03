var socket = io();
 
function sendMessage() {
  var message = document.getElementById("chat-input").value;
	
  //add username to message
	message = document.getElementById("target").value + " " + message;
  document.getElementById("chat-input").value = "";
  
  socket.emit('chat_sent', message);
}
 
socket.on('chat_received', function(msg) {
  var liNode, liText, ulMessages;
  console.log("Called once: " + msg);

  liNode = document.createElement("LI");
  liText = document.createTextNode(msg);
  
  liNode.appendChild(liText);
  
  ulMessages = document.getElementById("messages");
  ulMessages.appendChild(liNode);
  });
    