require('dotenv').config()

var debug = process.env.DEBUG_MODE == "true";

var url;
if (debug) {
	url = process.env.WEBSOCKET_URL_DEBUG;
} else {
	url = process.env.WEBSOCKET_URL_PROD;
}

import websocket_connections from '../websocket'
import Game from '../db/models/game'
import History from '../db/models/history'
import axios from 'axios';
import randomToken from 'random-token';

exports.start_game = async function (req, res) {
	/**
	 * Post /start  endpoint for starting a game.
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 * @returns { boolean } game started true/false
	 */
	let game_token = randomToken(16);

	History.findOne({
		gameEnded: null
	}).then(function (current_game) {
		if (current_game && current_game.game) {
			console.log("???");
			return res.status(500).send('Er is al een spel gestart.');
		}
		Game.findOne({
			_id: req.body.game_id
		}).then(function (game) {
			var newHistory = new History({
				game: game,
				game_token: game_token,
				gameStarted: new Date()
			});

			axios.post('http://' + url + '/start_game', {
					token: process.env.ADMIN_TOKEN,
					game_token: game_token,
					game_name: game.name,
					join_mid_game: game.joinMidGame,
					response_answer: game.responseAnswer
				})
				.then(function (response) {
					newHistory.save();
					websocket_connections.connect();
					res.status(200).send(response);
				})
				.catch(function (error) {
					res.status(500).send(error);
				});

		})
	})
}
exports.stop_game = async function (req, res) {
	/**
	 * Post /start  endpoint for starting a game.
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 * @returns { res } game started true/false
	 */
	History.findOne({
		gameEnded: null
	}).populate('game').then(function (current_game) {
		if (!current_game) {
			return res.status(500).send('Geen spel gestart.');
		} else {
			axios.post('http://' + url + '/stop_game', {
					token: process.env.ADMIN_TOKEN,
					game_name: current_game.game.name
				})
				.then(function (response) {
					current_game.gameEnded = new Date();
					current_game.save();
					websocket_connections.disconnect();
					res.send("Spel is gestopt.");
				})
				.catch(function (error) {
					res.status(500).send(error);
				});
		}
	});

}
exports.get_current = async function (req, res) {
	/**
	 * Get /currently  endpoint for getting current game status
	 * @export *
	 * @param  { any } req
	 * @param  { any } res
	 * @returns { object } current_game
	 */
	History.find({
		gameEnded: null
	}).then(function (game) {
		if (!game)
			res.send(false);
		res.send(game);
	});
}
exports.if_game_connect = async function () {
	/**
	 * loose function to check if game is connected and websocket should connect
	 * @export *
	 * @param  { any } req
	 * @param  { any } res
	 */
	History.findOne({
		gameEnded: null
	}).then(function (game) {
		if (game)
			websocket_connections.connect();
	});
}
exports.histories = async function (req, res) {
	/**
	 * Get /history  endpoint
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 * @returns { res } send all game histories
	 */
	History.find({}, {}, {
		sort: {
			'createdAt': -1
		}
	}).populate('game').then(function (histories) {
		res.render('index', {
			screen: 'histories',
			histories: histories
		})
	})
}
exports.history = async function (req, res) {
	/**
	 * Get /history/_id  endpoint
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 * @returns { res } send all histories of one game
	 */
	History.findOne({
		_id: req.params.id
	}).populate('game').populate('points').then(function (history) {
		History.find({
			game: history.game
		}).then(function (histories) {
			res.render('index', {
				screen: 'history',
				history: history,
				histories: histories,
				breadcrumbs: [
					['geschiedenis', 'history'],
					[history.game.name]
				]
			})
		})

	})
}