import Admin from '../db/models/admin'
import User from '../db/models/user'
import Game from '../db/models/game'
import History from '../db/models/history'

import osc_connection from '../osc'

exports.get_login = async function (req, res) {
	/**
	 * GET / login endpoint *
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 * @return { render } Returns the login page
	 */
	res.render('login');
}
exports.login = async function (req, res) {
	/**
	 * GET / login endpoint *
	 * @export *
	 * @param { any } req
	 * @param req.body.username {String} The Username
	 * @param req.body.password {String} The user's password
	 * @param { any } res
	 * @return { res } redirect to /
	 */
	var username = req.body.username,
		password = req.body.password;
	Admin.findOne({
		username: username
	}).then(function (admin) {
		if (!admin) {
			res.send("No user?")
		} else if (!admin.comparePassword(password)) {
			res.send("Wrong pass?");
		} else {
			req.session.admin = admin._id;
			res.redirect('/');
		}
	});
}
exports.logout = async function (req, res) {
	/**
	 * POST / login endpoint *
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 * @return { res } redirect to /login
	 */
	if (req.session.admin && req.cookies.user_sid) {
		res.clearCookie('user_sid');
		req.session.destroy();
		res.redirect('/login');
	} else {
		res.send("no session?");
	}
}
exports.get_home = async function (req, res) {
	/**
	 * GET / endpoint *
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 * @return { res } render index with home screen
	 */
	let data = {
		screen: 'home',
		name: null,
		games: [],
		last_game: {},
		current_game: false,
		next_game: null,
		osc_status: "NOT CONNECTED"
	}

	await Promise.all([
		Admin.findOne({
			_id: req.session.admin
		}).then(function (admin) {
			data.name = admin.username;
		}).catch((err) => {
			res.clearCookie('user_sid');
			req.session.destroy();
			res.redirect('/login');
		}),
		Game.find({}, function (err, games) {
			data.games = games;
		}),
	]);
	History.findOne({
		_id: {
			$exists: true
		}
	}, {}, {
		sort: {
			'createdAt': -1
		}
	}).populate('game').then(function (history) {
		if (history && history.game) {
			data.last_game = history;
			if (history.gameEnded == null)
				data.current_game = true;
			for (var i = 0; i < data.games.length; i++)
				if (data.games[i].name === history.game.name)
					data.next_game = data.games[i + 1] != undefined ? data.games[i + 1] : data.games[0];
		} else {
			data.next_game = data.games[Object.keys(data.games)[0]];
		}
		data.osc_status = osc_connection.osc_status();
		
		res.render('index', data);
	})

}
exports.get_users = async function (req, res) {
	/**
	 * GET / endpoint *
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 * @return { res } render index with users screen
	 */
	User.find({}, {}, {
		$sortByCount: 'points'
	}).then(function (users) {
		res.render('index', {
			screen: 'users',
			users: users
		})
	})
}
exports.get_user = async function (req, res) {
	/**
	 * GET / endpoint *
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 * @return { res } render index with user screen
	 */
	User.findOne({
		_id: req.params.id
	}).then(function (user) {
		if (!user) {
			res.send("no user found?")
		} else {
			res.render('index', {
				screen: 'user',
				user: user,
				breadcrumbs: [['gebruikers','users'], [user.email]]
			})
		}
	})
}