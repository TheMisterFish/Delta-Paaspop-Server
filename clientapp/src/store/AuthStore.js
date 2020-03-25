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
		auth_error(state, error) {
			console.log("error")
			state.status = error
		},
		logout(state) {
			console.log('logout?');
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
				.then(resp => {
					console.log(resp);
					let user = resp.data;
					let cookie = resp.headers["set-cookie"];
					console.log(cookie);
					axios.defaults.headers.Cookie = cookie;
					commit('auth_success', user)
				})
				.catch(err => {
					console.log(err);
					if (err.response != undefined) {
						commit('auth_error', err.response.data.error)
					} else {
						commit('auth_error', err);
					}
					localStorage.removeItem('session')
				})
		},

		logout({
			commit
		}) {
			return AuthApi
				.logout()
				.then(resp => {
					delete axios.defaults.headers.Cookie;
					commit('logout')
				})
				.catch(err => {
					commit('logout')
					console.log(err);
				});
		}
	},
	getters: {
		isLoggedIn: state => !!state.logged_in,
		authStatus: state => state.status,
	}
}

export default AuthStore;