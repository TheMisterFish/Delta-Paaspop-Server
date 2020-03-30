import axios from 'axios'
import {
	ErrorBus
} from '../busses/ErrorBus.js';

axios.defaults.withCredentials = true

const debug_mode = process.env.VUE_APP_DEBUG_MODE == "true";
var url = ""
if (debug_mode == true){
	url = "http://localhost:5454";
}
const UserApi = {
	game_status() {
		return axios
			.get(url + '/api/game_status')
			.then(response => response.data)
			.catch(err => {
				ErrorBus.$emit('Error', err);
			})
	},
	leaderboard() {
		return axios
			.get(url + '/api/leaderboard')
			.then(response => response.data)
			.catch(err => {
				console.log('err?')
				ErrorBus.$emit('Error', err);
			})
	},
	points() {
		return axios
			.get(url + '/api/points')
			.then(response => response.data)
			.catch(err => {
				ErrorBus.$emit('Error', err);
			})
	},
	randomName() {
		return axios
			.get(url + "/api/random_name")
			.then(response => response.data)
			.catch(err => {
				ErrorBus.$emit('Error', err);
			})
	},
	emailCheck(email) {
		return axios
			.post(url + '/api/email_check', {
				email: email
			})
			.then(response => response.data)
			.catch(err => {
				ErrorBus.$emit('Error', err);
			})
	}
}

export default UserApi;