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
	set_value: async function (key, value) {
		return await storage.setItem(key, value)
			.then(() => {
				if (debug)
					console.log('Stored ' + key + ' successfully');
				return storage.getItem(key);
			})
			.catch(err => console.error(err));
	},
	get_value: async function (key) {
		return await storage.getItem(key).then((value => {
			return value;
		}));
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