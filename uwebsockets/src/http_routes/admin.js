require('dotenv').config()

var funcs = require('../functions');
var middleware = require('../middleware')
var storage = require('../storage');
const admin_token = process.env.ADMIN_TOKEN;

module.exports = function (app) {
	app.post('/start_game', (res, req) => {
		funcs.readJson(res, (obj) => {
			console.log(obj);
			storage.set_value('game_token',obj.game_token)
			storage.set_value('game_name',obj.game_name)
			res.end('Thanks for this json!');
		}, () => {
			/* Request was prematurely aborted or invalid or missing, stop reading */
			console.log('Invalid JSON or no data at all!'); //SEND ERROR RESPONSE HERE
		});
	})
	app.post('/stop_game', (res, req) => {
		funcs.readJson(res, (obj) => {
			console.log(obj);
			storage.get_value('game_name').then((value) => {
				if(value == obj.game_name){
					storage.del_value('game_name');
					storage.del_value('game_token');
				} else {
					console.log("Game was not found?");
				}
			})
			// console.log(storage.getItem('token'));
			// console.log(storage.getItem('game_name'));
			res.end('Thanks for this json!');
		}, () => {
			/* Request was prematurely aborted or invalid or missing, stop reading */
			console.log('Invalid JSON or no data at all!'); //SEND ERROR RESPONSE HERE
		});
	})
}