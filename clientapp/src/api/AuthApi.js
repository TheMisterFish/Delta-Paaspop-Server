require('dotenv').config()
const adminport = process.env.ADMIN_PORT;
import axios from 'axios'
axios.defaults.withCredentials = true

const AuthApi = {
	login(user) {
		return axios
			.post('http://localhost:' + adminport + '/api/login', {
				email: user.email,
				password: user.password,
			}).then(response => response)
	},
	logout() {
		return axios
			.post('http://localhost:' + adminport + '/api/logout')
			.then(response => response.data)
	},
	register(data) {
		return axios
			.post('http://localhost:' + adminport + '/api/register', {
				email: data.email,
				password: data.password,
				nickname: data.nickname
			})
	}
}

export default AuthApi;