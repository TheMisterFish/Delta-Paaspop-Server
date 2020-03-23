import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/index'

import App from './App.vue'

import Home from './components/pages/HomeComponent.vue'
import Account from './components/pages/AccountComponent.vue'
import Leaderboard from './components/pages/LeaderboardComponent.vue'

import Login from './components/pages/LoginComponent.vue'
import Register from './components/pages/RegisterComponent.vue'

import NotFound from './components/pages/NotFoundComponent.vue'

import './assets/styles/paaspop_styling.scss'

Vue.use(VueRouter)

Vue.config.productionTip = false

// All routes
const routes = [{
		path: '/',
		component: Home,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/account',
		component: Account,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/leaderboard',
		component: Leaderboard,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/login',
		component: Login
	},
	{
		path: '/register',
		component: Register
	},
	{
		path: '*',
		component: NotFound
	}
]
const router = new VueRouter({
	routes
})

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (store.getters.isLoggedIn) {
			next()
			return
		}
		next()
	} else {
		next()
	}
})

new Vue({
	render: h => h(App),
	router,
	store,
	components: {
		App
	}
}).$mount('#app')