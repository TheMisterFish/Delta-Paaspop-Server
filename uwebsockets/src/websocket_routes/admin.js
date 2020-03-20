var funcs = require('../functions');
var middleware = require('../middleware')

module.exports = function (app) {
	app.ws('/admin', {
		idleTimeout: 302400,
		open: (ws, req) => {
			let client = funcs.getHeaderObject(req);
			if (middleware.ws_is_admin(ws, client)) {
				ws.subscribe('admin');
			} else {
				ws.close();
			}
		},
		/* For brevity we skip the other events */
		message: (ws, message, isBinary) => {
			ws.publish('admin', message, isBinary);
		},
		close: (ws, code, message) => {
			console.log("Admin disconnected ");
		}
	});
}