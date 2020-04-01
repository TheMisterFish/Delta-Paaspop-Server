import Vue from 'vue'
import Vuex from 'vuex'

import AuthStore from './AuthStore'
import GameStore from './GameStore'
import SocketStore from './SocketStore'

import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		AuthStore: AuthStore,
		GameStore: GameStore,
		SocketStore: SocketStore
	},
	plugins: [createPersistedState({
		paths: ["AuthStore", "GameStore"]
	})]
})