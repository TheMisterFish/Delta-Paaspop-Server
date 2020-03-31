var funcs = require('../functions');
var middleware = require('../middleware')

// Check for debug mode
require('dotenv').config()
const debug = process.env.DEBUG == "true";

module.exports = function (app) {
	app.ws('/admin', {
		idleTimeout: 302400,
		open: (ws, req) => {
			let client = funcs.getHeaderObject(req);
			if (middleware.ws_is_admin(ws, client)) {
				if (debug)
					console.log("A admin joined the /admin channel");
				ws.subscribe('admin');
			} else {
				if (debug)
					console.log("A not admin client tried to join the /admin channel");
				ws.close();
			}
		},
		/* For brevity we skip the other events */
		message: (ws, message, isBinary) => {
			ws.publish('admin', message, isBinary);
		},
		close: (ws, code, message) => {
			if (debug)
				console.log("Admin disconnected /admin channel");
		}
	});
}