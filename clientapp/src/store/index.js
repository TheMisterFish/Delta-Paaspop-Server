import Vue from 'vue'
import Vuex from 'vuex'

import AuthStore from './AuthStore'
import GameStore from './GameStore'

import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		AuthStore: AuthStore,
		GameStore: GameStore
	},
	plugins: [createPersistedState()]
})