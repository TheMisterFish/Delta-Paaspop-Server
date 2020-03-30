import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {
	AuthApi
} from '../api'

Vue.use(Vuex)

/* eslint-disable */

const AuthStore = {
	state: {
		status: '',
		user: {},
		logged_in: false
	},
	mutations: {
		auth_request(state) {
			state.status = 'loading'
		},
		auth_success(state, user) {
			state.status = 'success'
			state.user = user
			state.logged_in = true
		},
		logout(state) {
			state.status = ''
			state.user = {}
			state.logged_in = false
		},
	},
	actions: {
		login({
			commit
		}, user) {
			return AuthApi
				.login(user)
				.then((resp) => {
					let user = resp.data;
					let cookie = resp.headers["set-cookie"];
					axios.defaults.headers.Cookie = cookie;
					commit('auth_success', user)
				})
				.catch(localStorage.removeItem('session'));
		},

		logout({
			commit
		}) {
			return AuthApi
				.logout()
				.then(() => {
					delete axios.defaults.headers.Cookie;
					commit('logout')
				})
				.catch(commit('logout'));
		}
	},
	getters: {
		isLoggedIn: state => !!state.logged_in,
		user: state => state.user,
		authStatus: state => state.status,
	}
}

export default AuthStore;