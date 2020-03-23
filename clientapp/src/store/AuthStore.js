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
		token: localStorage.getItem('token') || '',
		user: {}
	},
	mutations: {
		auth_request(state) {
			console.log("auth_request")
			state.status = 'loading'
		},
		auth_success(state, token, user) {
			console.log("succes")
			state.status = 'success'
			state.token = token
			state.user = user
		},
		auth_error(state, error) {
			console.log("error")
			state.status = error
		},
		logout(state) {
			state.status = ''
			state.token = ''
		},
	},
	actions: {
		login({
			commit
		}, user) {
			console.log("login fired")
			console.log(user)
			return AuthApi
				.login(user)
				.then(resp => {
					console.log("resp:")
					console.log(resp)
					const token = resp.data.token
					const user = resp.data.user
					localStorage.setItem('token', token)
					axios.defaults.headers.common['Authorization'] = token
					commit('auth_success', token, user)
				})
				.catch(err => {
					if (err.response != undefined) {
						commit('auth_error', err.response.data.error)
					} else {
						commit('auth_error', err);
					}
					localStorage.removeItem('token')
				})
		},

		logout({
			commit
		}) {
			return AuthApi
				.logout()
				.then(resp => {
					localStorage.removeItem('token')
					delete axios.defaults.headers.common['Authorization']
					commit('logout')
				})
				.catch(err => {
					this.$store.dispatch("error", err)
				});
		}
	},
	getters: {
		isLoggedIn: state => !!state.token,
		authStatus: state => state.status,
	}
}

export default AuthStore;