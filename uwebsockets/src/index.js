const uws = require('uWebSockets.js');
require('dotenv').config()

const port = process.env.PORT; //not used yet since it doesnt seem to work?
// /* Non-SSL is simply App() */
const app = uws.App();

// include websocket routes
require('./websocket_routes/websocket_routes')(app);

// include http routes
require('./http_routes/admin')(app);

app.listen(parseInt(port), (listenSocket) => {
	if (listenSocket) {
		console.log('uWebsockets listening to port ', port);
	}
});

