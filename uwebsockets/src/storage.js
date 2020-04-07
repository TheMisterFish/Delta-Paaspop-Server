require('dotenv').config()
const storage = require('node-persist');

const debug = process.env.DEBUG == "true";

storage.init({
	dir: './storage/',
	stringify: JSON.stringify,
	parse: JSON.parse,
	encoding: 'utf8',
	logging: process.env.DEBUG, // can also be custom logging function
	ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS or a valid Javascript Date object
	expiredInterval: 10 * 60 * 1000, // every 10 minutes the process will clean-up the expired cache
	// in some cases, you (or some other service) might add non-valid storage files to your
	// storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
	forgiveParseErrors: false
});

const admin_token = process.env.ADMIN_TOKEN;

module.exports = {
	set_value: async function (obj) {

		storage.setItem('game_token', obj.game_token);
		storage.setItem('game_name', obj.game_name);
		storage.setItem('join_mid_game', obj.join_mid_game);
		storage.setItem('response_answer', obj.response_answer);
		return storage.getItem(game_name);
	},
	get_value: async function (key) {
		return await storage.getItem(key).then((value => {
			return value;
		}));
	},
	get_game: async function () {
		let obj = {};
		obj.game_token = await storage.getItem('game_token')
		obj.game_name = await storage.getItem('game_name')
		obj.join_mid_game = await storage.getItem('join_mid_game')
		obj.response_answer = await storage.getItem('response_answer')
		return obj;
	},
	del_value: async function (key) {
		return await storage.removeItem(key).then(() => {
			if (debug)
				console.log('Removed ' + key + ' successfully');
			return true;
		}).catch(err => console.error(err))
	},
	clean_all: async function () {
		if (debug)
			console.log('Removed all storage');
		return await storage.clear();
	}
}