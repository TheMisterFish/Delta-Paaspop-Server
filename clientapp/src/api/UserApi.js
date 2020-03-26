const adminport = process.env.VUE_APP_ADMINPORT;
import axios from 'axios'
axios.defaults.withCredentials = true
console.log(adminport);
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