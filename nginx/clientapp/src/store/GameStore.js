import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const GameStore = {
	state: {
		in_game: false,
		current_game: {},
	},
	mutations: {
		joined_game(state, game) {
			state.in_game = true;
			state.game = game;
		},
		exited_game(state) {
			state.in_game = false;
			state.current_game = {};
		}
	},
	actions: {
		joinGame({
			commit
		}, game) {
			commit('joined_game', game)
		},

		exitGame({
			commit
		}) {
			commit('exited_game')
		}
	},
	getters: {
		inGame: state => state.in_game,
		game: state => state.game,
	}
}

export default GameStore;