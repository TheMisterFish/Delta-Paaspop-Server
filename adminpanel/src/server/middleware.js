require('dotenv').config()
var pointsToken = process.env.POINTS_TOKEN;

exports.sessionChecker = (req, res, next) => {
	if (!req.session.user || !req.cookies.user_sid) {
		res.status(401).send("Not logged in");
	} else {
		next();
	}
};

exports.adminChecker = (req, res, next) => {
	if (!req.session.admin || !req.cookies.user_sid) {
		res.redirect('/login');
	} else {
		next();
	}
};

exports.gameTokenChecker = (req, res, next) => {
	if (req.body.token != pointsToken) {
		res.status(401).send("Wrong credentials");
	} else {
		next();
	}
}