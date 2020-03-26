require('dotenv').config()

const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var cors = require('cors')

app.use(cors({
	credentials: true,
	origin: true
}))

// Import all database related things (models and stuff)
import db from './server/db'

// Import websocket connection
import websocket_connections from './server/websocket'
websocket_connections.connect('admin');

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json())

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// Require all the database logic
require('./server/db')(app);

// Set frontend things
app.set('view engine', 'pug')
app.set('public', path.join(__dirname, '/front-end/public'));
app.set('views', path.join(__dirname, '/front-end/views'));
app.use(express.static(path.join(__dirname, '/front-end/public')));
app.locals.basedir = path.join(__dirname, '/front-end/public');

console.log("KAAAAAAAAS");
// TEST
const fs = require('fs');
//joining path of directory 
const directoryPath = path.join(__dirname, '/front-end/public');
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
	//handling error
	if (err) {
		return console.log('Unable to scan directory: ' + err);
	}
	//listing all files using forEach
	files.forEach(function (file) {
		// Do whatever you want to do with the file
		console.log(file);
	});
});
// TEST
// admin routes
require('./server/routes/adminRoutes')(app);
// user api routes
require('./server/routes/userRoutes')(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))