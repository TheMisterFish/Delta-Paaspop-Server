import axios from 'axios'

const AuthApi = {
	login(user) {
		return axios
			.post('http://localhost:3000/api/login', {
				email: user.email,
				password: user.password,
			}, {
				withCredentials: true,
			}).then(response => response)
	},
	logout() {
		return axios
			.post('http://localhost:3000/api/logout', {}, {
				withCredentials: true,
			})
			.then(response => response.data)
	}
}

export default AuthApi;