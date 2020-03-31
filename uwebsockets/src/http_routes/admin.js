require('dotenv').config()

var funcs = require('../functions');
var middleware = require('../middleware')
var storage = require('../storage');
const admin_token = process.env.ADMIN_TOKEN;

// check for debug mode
const debug = process.env.DEBUG == "true";

module.exports = function (app) {
	app.post('/start_game', (res, req) => {
		funcs.readJson(res, (obj) => {
			console.log(obj);
			storage.set_value('game_token', obj.game_token)
			storage.set_value('game_name', obj.game_name)
			storage.set_value('join_mid_game', obj.join_mid_game == true ? "true" : "false")
			if (debug) {
				console.log("Stored game_token: ", obj.game_token);
				console.log("Can join mid-game: ", obj.join_mid_game == true ? "True" : "False");
				console.log("Started game ", obj.game_name);
			}
			res.writeStatus('200');
			res.end('Game started');
		}, () => {
			if (debug)
				console.log('Invalid JSON or no data at all!'); //SEND ERROR RESPONSE HERE
			res.writeStatus('417');
			res.end('Not valid request');
		});
	})
	app.post('/stop_game', (res, req) => {
		funcs.readJson(res, (obj) => {
			console.log(obj);
			storage.get_value('game_name').then((value) => {
				if (value == obj.game_name) {
					storage.clean_all();
					if (debug)
						console.log("Cleared all game data");
				} else {
					if (debug)
						console.log("Game was not found?");
					res.writeStatus('409');
					res.end('No game was found');
				}
			})
			res.writeStatus('200');
			res.end('Thanks for this json!');
		}, () => {
			if (debug)
				console.log('Invalid JSON or no data at all!'); //SEND ERROR RESPONSE HERE
			res.writeStatus('417');
			res.end('Not valid request');
		});
	})
}