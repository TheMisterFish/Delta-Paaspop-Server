import {
	adminChecker
} from '../middleware';

import { AdminController } from '../controllers'

module.exports = function (app) {

	app.get('/login', AdminController.get_login);
	app.post('/login', AdminController.login);
	app.all('/logout', AdminController.logout)
	app.get('/', adminChecker, AdminController.get_home);
	app.get('/users', adminChecker, AdminController.get_users)
	app.get('/users/:id', adminChecker, AdminController.get_user)

	//other routes..
}