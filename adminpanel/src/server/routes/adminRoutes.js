import {
	adminChecker
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

	// Game controller
	app.post('/game/start', adminChecker, GameController.start_game);
	app.post('/game/stop', adminChecker, GameController.stop_game);
	app.get('/game/currently', adminChecker, GameController.get_current);
	app.get('/history', adminChecker, GameController.histories)
	app.get('/history/:id', adminChecker, GameController.history);
	
	// Points controller
<<<<<<< HEAD
	app.get('/points/game/:id', adminChecker, PointsController.game);
	app.post('/points/apply', adminChecker, PointsController.apply_points)
=======
	app.post('/points/game/:id', adminChecker, PointsController.game);
>>>>>>> client_app

	// Websocket controller
	app.get('/ws/test', adminChecker, WebsocketsController.test);
	app.get('/ws/connected', adminChecker, WebsocketsController.ws_connected);
	app.get('/ws/admin', adminChecker, WebsocketsController.adminSockets)
	app.get('/ws/game', adminChecker, WebsocketsController.gameSockets)
}