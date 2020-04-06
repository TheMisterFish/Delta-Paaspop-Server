require('dotenv').config()
const admin_token = process.env.ADMIN_TOKEN;
const game_token = process.env.GAME_TOKEN;
var storage = require('./storage');

module.exports = {
	ws_is_admin: function (ws, client) {
		if (client.token == admin_token)
			return true
		return false;
	},
	http_is_admin: function (obj) {
		if (obj.token == admin_token)
			return true;
		return false;
	},
	ws_is_user: async function (ws, client) {
		return await storage.get_value('game_token').then((value) => {
			let token;
			try {
				token = client['sec-websocket-protocol'].split(":");
			} catch (error) {
				return false;
			}
			if (token[0] == "token" && token[1] == value) {
				return true
			}
			return false;
		});
	},
	ws_is_game: function (ws, client) {
		try {
			token = client['sec-websocket-protocol'].split(":");
		} catch (error) {
			return false;
		}
		if (token[0] == "token" && token[1] == game_token) {
			return true
		}
		return false;
	},
	game_running: async function () {
		return await storage.get_value('game_name').then((value) => {
			return value;
		}).catch((err) => {
			console.log(err);
			return false;
		});
	},
}