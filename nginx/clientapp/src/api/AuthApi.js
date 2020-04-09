import axios from 'axios'
import {
	ErrorBus
} from '../busses/ErrorBus.js';

axios.defaults.withCredentials = true

const debug_mode = process.env.VUE_APP_DEBUG_MODE == "true";
var url = ""
if (debug_mode) 
	url = "http://localhost:5454";
	
const AuthApi = {
	login(user) {
		return axios
			.post(url + '/api/login', {
				email: user.email,
				password: user.password,
			}).then(response => response).catch(err => {
				ErrorBus.$emit('LoginError', err.response.status);
			})
	},
	logout() {
		return axios
			.post(url + '/api/logout')
			.then(response => response.data)
			.catch(err => {
				ErrorBus.$emit('Error', err);
			})
	},
	register(data) {
		return axios
			.post(url + '/api/register', {
				email: data.email,
				password: data.password,
				nickname: data.nickname
			}).then(response => response.data);
	}
}

export default AuthApi;