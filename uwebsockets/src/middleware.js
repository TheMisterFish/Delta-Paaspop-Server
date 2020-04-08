require('dotenv').config()
const admin_token = process.env.ADMIN_TOKEN;
const game_token = process.env.GAME_TOKEN;
var storage = require('./storage');

module.exports = {
	ws_check_role: async function (ws, client) {
		let role = "";
		if (client.token == admin_token) {
			role = "admin";
		} else if(client.token == game_token){
			role = "game";
		} else if (client['sec-websocket-protocol'] != undefined) {
			let token;
			try {
				token = client['sec-websocket-protocol'].split(".");
				console.log(token);
				if (token[0] == "token" && token[1] == game_token) {
					role = "game"
				} else if (token[0] == "token" && token[1] == await storage.get_value('game_token')) {
					role = "user";
				}
			} catch (error) {
				if(debug)
					console.log(error)
			}
		}
		return role;
	},

	http_is_admin: function (obj) {
		if (obj.token == admin_token)
			return true;
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