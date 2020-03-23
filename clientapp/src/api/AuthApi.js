import axios from 'axios'

const AuthApi = {
	login(user) {
		return axios
			.post('http://localhost:3000/login', {
				email: user.email,
				password: user.password
			}, {
				headers: {
					"Content-Type": "application/json"
				}
			}).then(response => response.data)
	},
	logout() {
		return axios
			.post('http://localhost:3000/logout')
			.then(response => response.data)
	}
}

export default AuthApi;