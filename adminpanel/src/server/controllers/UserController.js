import User from '../db/models/user'
import History from '../db/models/history'

exports.login = async function (req, res) {
	/**
	 * POST /api/login endpoint *
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 */
	var email = req.body.email,
		password = req.body.password;
	User.findOne({
		email: email
	}).then(function (user) {
		if (!user) {
			res.status(400).send(["Cannot log in"]);
		} else if (!user.comparePassword(password)) {
			res.status(400).send(["Wrong password"]);
		} else {
			req.session.user = user._id;
			let this_user = {
				email: user.email,
				nickname: user.nickname
			}
			res.send(this_user);
		}
	}).catch((err) => {
		console.log(err);
	});
}
exports.register = async function (req, res) {
	/**
	 * POST /api/register endpoint *
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 */
	console.log("came here");
	console.log(req.body);
	User.create({
			email: req.body.email,
			password: req.body.password,
			nickname: req.body.nickname,
			verified: false
		})
		.then(user => {
			req.session.user = user._id;
			res.send("User registered")
		})
		.catch(error => {
			console.log(error);
			res.status(400).send(["Register error"]);
		});
}
exports.logout = async function (req, res) {
	/**
	 * POST /api/logout *
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 */
	if (req.session.user && req.cookies.user_sid) {
		res.clearCookie('user_sid');
		req.session.destroy();
		res.send("Logged out");
	} else {
		res.send("No session");
	}
}
exports.game_status = async function (req, res) {
	/**
	 * Get  /api/game_status
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 * @return { res } json including game_token and game_name
	 */
	History.findOne({
		gameEnded: null
	}).populate('game').then(function (current) {
		if (current && current.game) {
			let game_data = {
				game_token: current.game_token,
				game_name: current.game.name
			}
			res.send(game_data);
		} else {
			res.send(false);
		}
	});
}
exports.leaderboard = async function (req, res) {
	/**
	 * Get  /api/leaderboard
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 * @return { res } json of usenickname & points rs sorted by amount of points
	 */
	User.find({}, {}, {
		$sortByCount: 'points'
	}).select('nickname').select('points').populate('point').then(function (users) {
		let data = [];
		for (let u = 0; u < users.length; u++) {
			let user = users[u];
			let points = 0;
			for (let p = 0; p < user.points.length; p++) {
				let point = user.points[p];
				points += point.points;
			}
			let thisUser = {
				nickname: user.nickname,
				points: points
			};
			data.push(thisUser);
		}
		res.send({
			data
		});
	})
}
exports.test = async function (req, res) {
	/**
	 * Get  /api/leaderboard
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 * @return { res } json of usenickname & points rs sorted by amount of points
	 */
	console.log(req.headers);
	res.send("HOI");
}
exports.random_name = async function (req, res) {
	let name = null;
	do {
		let newName = randomName();
		let user = await User.findOne({
			nickname: newName
		})
		if (!user)
			name = newName;
	} while (name == null);
	res.send(name);
}

function randomName() {
	let nickname = "";

	var fs = require('fs'),
		path = require('path'),
		filePath = path.join(__dirname, '../random_names/');

	let firstWordsList = ['de', 'de', 'een']
	let secondWordsList = fs.readFileSync(filePath + 'secondword.txt').toString('utf-8').split("\n");
	let thirdWordsList = fs.readFileSync(filePath + 'thirdword.txt').toString('utf-8').split("\n");

	if (getRandomInt(4) != 1) {
		nickname += capitalizeFirstLetter(firstWordsList[getRandomInt(firstWordsList.length)]);
	}
	nickname += capitalizeFirstLetter(secondWordsList[getRandomInt(secondWordsList.length)]);
	if (getRandomInt(8) == 1) {
		nickname += capitalizeFirstLetter(secondWordsList[getRandomInt(secondWordsList.length)]);
	}
	nickname += capitalizeFirstLetter(thirdWordsList[getRandomInt(thirdWordsList.length)]);

	return nickname.replace(/\n/g, "").replace(/\r/g, "");
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}