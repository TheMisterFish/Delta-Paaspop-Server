import Point from '../db/models/point'

import {
	adminChecker
} from '../middleware';

import {
	GameController
} from '../controllers'


module.exports = function (app) {
	app.post('/game/start', adminChecker, GameController.start_game);
	app.post('/game/stop', adminChecker, GameController.stop_game);
	app.get('/game/currently', adminChecker, GameController.get_current);
	app.get('/history', adminChecker, GameController.histories)
	app.get('/history/:id', adminChecker, GameController.history);
}