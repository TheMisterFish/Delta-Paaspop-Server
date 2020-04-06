import {
	adminChecker, gameTokenChecker
} from '../middleware';

import { AdminController, GameController, PointsController, WebsocketsController } from '../controllers'

module.exports = function (app) {
	// Admin controller
	app.get('/login', AdminController.get_login);
	app.post('/login', AdminController.login);
	app.all('/logout', AdminController.logout)
	app.get('/', adminChecker, AdminController.get_home);
	app.get('/users', adminChecker, AdminController.get_users)
	app.get('/users/:id', adminChecker, AdminController.get_user)
	app.get('/history', adminChecker, GameController.histories)
	app.get('/history/:id', adminChecker, GameController.history);

	// Game controller
	app.post('/game/start', adminChecker, GameController.start_game);
	app.post('/game/stop', adminChecker, GameController.stop_game);
	app.post('/game/round_start', gameTokenChecker, GameController.start_round);
	app.post('/game/admin_round_start', adminChecker, GameController.start_round);
	app.get('/game/currently', adminChecker, GameController.get_current);
	
	// Points controller
	app.post('/points/game/:id', gameTokenChecker, PointsController.game);

	// Websocket controller
	app.get('/ws/test', adminChecker, WebsocketsController.test);
	app.get('/ws/connected', adminChecker, WebsocketsController.ws_connected);
	app.get('/ws/admin', adminChecker, WebsocketsController.adminSockets)
}