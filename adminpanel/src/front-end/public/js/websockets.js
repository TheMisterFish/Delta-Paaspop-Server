var token = document.getElementById('token').innerText;
var route = document.getElementById('route').innerText;
var textbox = document.getElementById('socketChannel');
var message = document.getElementById('message');
let socket = new WebSocket('ws://' + location.hostname + ':9000', ["token", token]);

		var input = document.getElementById("message");

		input.addEventListener("keyup", function (event) {
			if (event.keyCode === 13) {
				event.preventDefault();
				document.getElementById("sendbutton").click();
			}
		});

		socket.onopen = function (e) {
			addText("[status] Connected to ws://" + location.hostname + ":9000");
		}; socket.onmessage = function (event) {
			addText(`[message] Data received from server: ${event.data}`);
		};

		socket.onclose = function (event) {
			if (event.wasClean) {
				addText(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
			} else {
				addText('[close] Connection died');
			}
		};

		socket.onerror = function (error) {
			addText(`[error] ${error.message}`);
		};

		function addText(message) {
			var d = new Date();
			var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
				d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);

			textbox.value += datestring + " " + message + '\n';
			textbox.scrollTop = textbox.scrollHeight;
		}

		function sendText() {
			socket.send(message.value);
			addText('[sending] ' + message.value);
			message.value = "";
		}