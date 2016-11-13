var uri = window.location.pathname;
var socket = io(); //sets the namespace to be the uri
 
 function sendMessage() {
     var message = document.getElementById("chat-input").value;
	 document.getElementById("chat-input").value = "";
	 message = document.getElementById("target").value + " " + message;
	 debugger;
    socket.emit('chat_sent', message);

 }
 
 socket.on('chat_received', function(msg) {
        var liNode, liText, ulMessages;
        liNode = document.createElement("LI");
        liText = document.createTextNode(msg);
        liNode.appendChild(liText);
        ulMessages = document.getElementById("messages");
        ulMessages.appendChild(liNode);
        //ulMessages.insertBefore(liNode, ulMessages.childNodes[0]);
        //console.log("Called once: " + msg);
        
    });