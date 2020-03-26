import axios from 'axios'
axios.defaults.withCredentials = true

const UserApi = {
	game_status() {
		return axios
		.get("http://localhost:3000/api/game_status")
		.then(response => response.data)
	},
	leaderboard() {
		return axios
			.get('http://localhost:3000/api/leaderboard')
			.then(response => response.data)
	},
	points() {
		return axios
			.get('http://localhost:3000/api/points')
			.then(response => response.data)
	}
}

export default UserApi;