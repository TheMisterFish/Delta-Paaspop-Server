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

	if (!email || !password) {
		res.status(406).send("Fill in something");
		return;
	}
	User.findOne({
		email: email
	}).then(function (user) {
		if (!user) {
			res.status(403).send("Cannot log in");
		} else if (!user.comparePassword(password)) {
			res.status(403).send("Wrong password");
		} else {
			req.session.user = user._id;
			let this_user = {
				email: user.email,
				nickname: user.nickname,
				id: user._id
			};
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
	var email = req.body.email,
		password = req.body.password,
		nickname = req.body.nickname

	if (!email || !password || !nickname) {
		res.status(406).send("Fill in all the fields");
		return;
	}

	User.create({
			email: email,
			password: password,
			nickname: nickname,
			verified: false
		}).then(user => {
			req.session.user = user._id;
			res.status(201).send("User registered")
		})
		.catch(error => {
			console.log(error);
			res.status(400).send("Register error");
		});
}
exports.checkEmail = async function (req, res) {
	/**
	 * POST /api/checkEmail endpoint *
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 */
	var email = req.body.email;
	if (!email) {
		req.status(204).send("No email")
		return;
	}
	User.find({
		email: email
	}).then(user => {
		if (user.length == 0) {
			res.status(200).send(true)
		} else {
			console.log(user);
			res.status(200).send(false)
		}
	}).catch((error) => {
		res.status(500).send("error?");
		console.log(error)
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
		res.status(200).send("Logged out");
	} else {
		res.status(410).send("Nog logged in");
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
			let game_data = {};
			if (current.game.joinMidGame == false && current.roundStarted) {
				game_data.cannot_join = true;
				game_data.round_started = current.roundStarted;
				game_data.game_name = current.game.name;
			} else {
				game_data.round_started = current.roundStarted;
				game_data.game_token = current.game_token;
				game_data.game_name = current.game.name;
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
	User.find().select('nickname').select('points').populate('points').exec(function (err, users) {
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
		data.sort((a, b) => { return a.points < b.points })
		res.send({
			data
		});
	})
}
exports.points = async function (req, res) {
	/**
	 * Get  /api/leaderboard
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 * @return { res } json of usenickname & points rs sorted by amount of points
	 */
	User.findOne({
		_id: req.session.user
	}).populate('points').then(function (user) {
		if (!user) {
			res.status(400).send(["No user?"]);
		} else {
			let total_points = 0;
			for (let y = 0; y < user.points.length; y++) {
				const element = user.points[y];
				total_points += element.points;
			}
			let data = {
				points: total_points
			}
			res.send(data);
		}
	}).catch((err) => {
		console.log(err);
	});
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