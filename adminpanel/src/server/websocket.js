require('dotenv').config()
const WebSocketClient = require('websocket').client;

var reconnect = process.env.WEBSOCKET_AUTOCONNECT == "true";
var debug = process.env.DEBUG_MODE == "true";

var url;
if (debug) {
	url = process.env.WEBSOCKET_URL_DEBUG;
} else {
	url = process.env.WEBSOCKET_URL_PROD;
}
// Admin websocket connection
var admin = new WebSocketClient();
admin.connection = {
	connected: false
};
admin.name = 'admin';
admin.on('connectFailed', function (error) {
	admin.connection.connected = false;
	console.log(error);
	if (reconnect)
		retryAdminConnection()
});
admin.on('connect', function (connection) {
	admin.connection = connection;
	console.log('Admin websocket Client Connected (connect function)');

	connection.on('error', function (error) {
		admin.connection = connection;
		console.log("Connection Error: " + error.toString());

	});

	connection.on('close', function () {
		admin.connection = connection;
		console.log('admin Connection Closed');
		if (reconnect)
			retryAdminConnection()
	});

	connection.on('message', function (message) {
		if (message.type === 'utf8') {
			console.log("Received: '" + message.utf8Data + "'");
		}
	});
});

function retryAdminConnection() {
	console.log("Admin webscoekt connection failed, retrying in 5 seconds");
	setTimeout(() => {
		admin.connect('ws://' + url + '/admin', ["token", process.env.ADMIN_TOKEN])
	}, 5000);
}

var game = new WebSocketClient();
game.connection = {
	connected: false
};
game.name = 'game';
game.on('connectFailed', function (error) {
	game.connected = false;
});
game.on('connect', function (connection) {
	game.connection = connection;
	console.log('WebSocket Game client Connected (connect function)');

	connection.on('error', function (error) {
		game.connection = connection;
		console.log("Connection Error: " + error.toString());
	});

	connection.on('close', function () {
		game.connection = connection;
		console.log('WebSocket Game connection closed (probably because there is no game)');
	});

	connection.on('message', function (message) {
		if (message.type === 'utf8') {
			console.log("Received: '" + message.utf8Data + "'");
		}
	});
});

exports.connect = async function (client = "game") {

	if (client == "admin") {
		return new Promise((resolve, reject) => {
			admin.connect('ws://' + url + '/', ["token", process.env.ADMIN_TOKEN]);
			setTimeout(function () {
				resolve(admin.connection.connected) // Yay! Everything went well!
			}, 500)
		})
	} else {
		return new Promise((resolve, reject) => {
			game.connect('ws://' + url + '/', ["token", process.env.GAME_TOKEN]);
			setTimeout(function () {
				resolve(game.connection.connected) // Yay! Everything went well!
			}, 500)
		})
	}
};

exports.connected = function (client = "game") {
	if (client == "admin") {
		return admin.connection.connected;
	} else {
		return game.connection.connected;
	}
};

exports.disconnect = function (client = "game") {
	if (client == "admin") {
		if (admin.connection.connected) {
			admin.connection.close();
			return true;
		}
		return false;
	} else if (client == "game") {
		if (game.connection.connected) {
			game.connection.close();
			return true;
		}
		return false;
	}
}

exports.send = function (client = "game", message = "-") {
	if (client == "admin" && admin.connection.connected) {
		admin.connection.sendUTF(message.toString());
		return true;
	} else if (client == "game" && game.connection.connected) {
		game.connection.sendUTF(message.toString());
		return true;
	}
	return false;
}