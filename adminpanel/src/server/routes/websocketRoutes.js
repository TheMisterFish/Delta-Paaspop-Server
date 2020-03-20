import {
	adminChecker
} from '../middleware';

import {
	WebsocketsController
} from '../controllers'

module.exports = function (app) {
	app.get('/ws/test', adminChecker, WebsocketsController.test);
	app.get('/ws/connected', adminChecker, WebsocketsController.ws_connected);
}