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

const db_object = {
	port: process.env.MONGO_PORT,
	host: process.env.MONGO_URL,
	user: process.env.MONGO_USERNAME,
	pass: process.env.MONGO_PASSWORD,
}
var connection_string = process.env.MONGO_CONNECTION_STRING;

mongoose.connect(connection_string, {
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