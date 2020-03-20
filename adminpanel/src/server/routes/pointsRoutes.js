import {
	adminChecker
} from '../middleware';

import {
	PointsController
} from '../controllers'


module.exports = function (app) {
	app.get('/points/game/:id', adminChecker, PointsController.game);
	app.get('/points/user/:id', adminChecker, PointsController.user);
}