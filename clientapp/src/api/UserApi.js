require('dotenv').config()
const adminport = process.env.ADMIN_PORT;
import axios from 'axios'
axios.defaults.withCredentials = true

const UserApi = {
	game_status() {
		return axios
			.get('http://localhost:' + adminport + '/api/game_status')
			.then(response => response.data)
	},
	leaderboard() {
		return axios
			.get('http://localhost:' + adminport + '/api/leaderboard')
			.then(response => response.data)
	},
	points() {
		return axios
			.get('http://localhost:' + adminport + '/api/points')
			.then(response => response.data)
	}
}

export default UserApi;