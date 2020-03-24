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
			res.send(user);
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
	User.create({
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			nickname: req.body.nickname
		})
		.then(user => {
			req.session.user = user._id;
			res.send("User registered")
		})
		.catch(error => {
			console.log(error);
			res.send("Coulnd't register")
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
	}).select('nickname').select('points').populate('points').then(function (users) {
		res.send(users);
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