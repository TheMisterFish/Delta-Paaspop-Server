require('dotenv').config()

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

import adminSeeder from './seeders/adminSeeder'
import gameSeeder from './seeders/gameSeeder'

import {
	GameController
} from '../controllers'

mongoose.set('useCreateIndex', true);

var debug = process.env.DEBUG_MODE == "true";
var connection_string;
if (debug) {
	connection_string = process.env.MONGO_CONNECTION_STRING_DEBUG;
} else {
	connection_string = process.env.MONGO_CONNECTION_STRING_PROD;
}


mongoose.connect(connection_string, {
		useUnifiedTopology: true,
		useNewUrlParser: true
	})
	.then(() => console.log('DB Connected!'))
	.then(() => {
		GameController.if_game_connect()
	})
	.catch(err => {
		console.log("Couldn't connect to DB");
	});

module.exports = function (app) {
	console.log("setting sessions to mongo store")
	app.use(session({
		key: 'user_sid',
		store: new MongoStore({
			mongooseConnection: mongoose.connection
		}),
		secret: 'somerandonstuffs',
		resave: false,
		saveUninitialized: false,

	}));
}