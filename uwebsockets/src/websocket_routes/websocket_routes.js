var funcs = require('../functions');
var middleware = require('../middleware')
var storage = require('../storage');

// Check for debug mode
require('dotenv').config()
const debug = process.env.DEBUG == "true";

module.exports = function (app) {
	app.ws('/', {
		idleTimeout: 302400,
		open: (ws, req) => {
			let client = funcs.getHeaderObject(req);
			middleware.game_running().then((game) => {
				if (middleware.ws_is_admin(ws, client)) {
					if (debug)
						console.log("A admin joined the /admin channel");
					ws.role = "admin";
					ws.subscribe('admin_channel');
				} else if (game != undefined) {
					if (middleware.ws_is_user(ws, client)) {
						ws.role = "user";
						ws.subscribe('user_channel');
						if (debug)
							console.log("User joinend user channel '/users' for the game: ", game)
						ws.publish('admin', "User joined user channel: ", game);
					} else if (middleware.ws_is_game(ws, client)) {
						ws.role = "game";
						ws.subscribe('game_channel');
						if (debug)
							console.log("Game joinend user channel '/game' for the game: ", game)
						ws.publish('admin', "User joined user channel: ", game);
					} else {
						if (debug)
							console.log("Client tried to join /user but failed");
						ws.close();
					}
				} else {
					ws.close();
				}
			});
		},
		/* For brevity we skip the other events */
		message: (ws, message, isBinary) => {
			let convertedMessage = funcs.AB2String(message)
			if (ws.role == "admin") {
				if (debug)
					console.log("Received '" + convertedMessage + "' on admin_channel")
				if (convertedMessage.startsWith("/game")) {
					if (debug)
						console.log("Sending " + convertedMessage.replace("/game ", "") + " to /game channel")
					ws.publish('game_channel', convertedMessage.replace("/game ", ""), false);
					ws.send("Published to game_channel");
				} else if (convertedMessage.startsWith("/users")) {
					if (debug)
						console.log("Sending " + convertedMessage.replace("/users ", "") + " to /users channel")
					ws.publish('user_channel', convertedMessage.replace("/users ", ""), false);
					ws.send("Published to user_channel");
				} else {
					ws.publish('admin_channel', convertedMessage, false)
				}
			} else if (ws.role == "user") {
				if (debug)
					console.log("Received '" + convertedMessage + "' on user_channel")

				storage.get_game().then((game) => {
					if (game != undefined) {
						console.log(game);
						ws.publish('game_channel', convertedMessage, false);
						ws.publish('admin_channel', 'user said: ' + convertedMessage);
						let returnData = {
							action: game.response_answer
						}
						ws.send(JSON.stringify(returnData))
					}
				});
			} else if (ws.role == "game") {
				if (debug)
					console.log("Received '" + convertedMessage + "' on user_channel")
				ws.publish('user_channel', convertedMessage, false);
				ws.publish('admin_channel', 'game said: ' + convertedMessage, false);
			} else {
				if (debug)
					console.log("Client seems to not be any good role... removing him from my websocket >.<")
				ws.end();
			}
		},
		close: (ws, code, message) => {
			if (debug)
				console.log(ws.role, "closed connection")
		}

	});
}