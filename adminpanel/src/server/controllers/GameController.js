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
					websocket_connections.send("admin", "/game {'startGame': '" + game.name + "'}");

					res.status(200).send("Started game");
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
					websocket_connections.send("admin", "/game {'stopGame': '"+current_game.game.name+"'}");
					websocket_connections.disconnect();
					res.send("Spel is gestopt.");
				})
				.catch(function (error) {
					res.status(500).send(error);
				});
		}
	});
}
exports.stop_game_game = async function (req, res) {
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
					res.send(true);
				})
				.catch(function (error) {
					res.status(500).send(error);
				});
		}
	});
}
exports.start_round = async function (req, res) {
	console.log("?");
	History.findOne({
		gameEnded: null
	}).then(function (current_game) {
		if (current_game && current_game.game) {
			current_game.roundStarted = true;
			current_game.save().then(() => {
				return res.status(200).send('Eerste ronde is gestart');
			}).catch(() => {
				console.log("Something whent wrong at 'game_started'");
				return res.status(500).send('Iets ging fout.');
			});
		} else {
			return res.status(500).send('Er geen spel gestart.');
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
	}).populate('game').populate('points').then(function (histories) {
		var transformedHistories = histories.map(function (history) {
			return history.toJSON();
		});
		for (let q = 0; q < transformedHistories.length; q++) {
			const element = transformedHistories[q];
			let total_points = 0;
			element.points.forEach(points => {
				total_points += points.points;
			});
			transformedHistories[q].totalPoints = total_points;
		}
		res.render('index', {
			screen: 'histories',
			histories: transformedHistories
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
	}).populate('game').populate({
		path: 'points',
		populate: {
			path: 'user',
			model: 'User'
		},
	}).then(function (history) {
		var transformedHistory = history.toJSON()
		const element = transformedHistory;
		let total_points = 0;
		element.points.forEach(points => {
			total_points += points.points;
		});
		transformedHistory.totalPoints = total_points;

		console.log(transformedHistory);

		History.find({
			game: history.game
		}).then(function (histories) {
			res.render('index', {
				screen: 'history',
				history: transformedHistory,
				histories: histories,
				breadcrumbs: [
					['geschiedenis', 'history'],
					[history.game.name]
				]
			})
		})

	})
}

exports.osc_start_game = async function () {
	/**
	 * OSC start game function.
	 * @returns { boolean } game started true/false
	 */
	let game_token = randomToken(16);

	History.findOne({
		gameEnded: null
	}).then(function (current_game) {
		if (current_game && current_game.game) {
			return false;
		}
		const all_games = History.find({});
		const last_game = History.findOne({}, {}, {
			sort: {
				'created_at': -1
			}
		});
		let new_game;

		for (let index = 0; index < all_games.length; index++) {
			const game = all_games[index];
			if (game._id == last_game._id) {
				if (index == all_games.length) {
					new_game = all_games[0];
				} else {
					new_game = all_games[index + 1];
				}
				break
			}
		}

		Game.findOne({
			_id: new_game._id
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
					return true;
				})
				.catch(function (error) {
					return false;
				});
		})
	})
}

exports.osc_stop_game = async function () {
	/**
	 * OSC stop game function.
	 * @returns { boolean } game started true/false
	 */
	History.findOne({
		gameEnded: null
	}).populate('game').then(function (current_game) {
		if (!current_game) {
			return false;
		} else {
			axios.post('http://' + url + '/stop_game', {
					token: process.env.ADMIN_TOKEN,
					game_name: current_game.game.name
				})
				.then(function (response) {
					current_game.gameEnded = new Date();
					current_game.save();
					websocket_connections.disconnect();
					return true;
				})
				.catch(function (error) {
					return false;
				});
		}
	});
}