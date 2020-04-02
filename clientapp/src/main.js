import Vue from 'vue'
import VueRouter from 'vue-router'
import Vue2TouchEvents from 'vue2-touch-events'
import Vuelidate from 'vuelidate';
import VueNativeSock from "vue-native-websocket";

import store from './store/index'

import App from './App.vue'

import Home from './components/pages/HomeComponent.vue'
import Account from './components/pages/AccountComponent.vue'
import Leaderboard from './components/pages/LeaderboardComponent.vue'
import Login from './components/pages/LoginComponent.vue'
import Register from './components/pages/RegisterComponent.vue'
import NotFound from './components/pages/NotFoundComponent.vue'
import Game from './components/game/GameComponent.vue'

import './assets/styles/paaspop_styling.scss'

Vue.use(VueNativeSock, "ws://localhost:9000", {
	connectManually: true,
});
Vue.use(VueRouter)
Vue.use(Vue2TouchEvents)
Vue.use(Vuelidate);

Vue.config.productionTip = false

// All routes
const routes = [{
		path: '/',
		component: Home,
		name: "home",
		meta: {
			requiresAuth: true,
		}
	},
	{
		path: '/account',
		component: Account,
		name: "account",
		meta: {
			requiresAuth: true,
		}
	},
	{
		path: '/leaderboard',
		component: Leaderboard,
		name: "leaderboard",
		meta: {
			requiresAuth: true,
		}
	},
	{
		path: '/login',
		component: Login,
		name: "login",
		meta: {
			requiresNoUser: true
		}
	},
	{
		path: '/register',
		component: Register,
		name: "register",
		meta: {
			requiresNoUser: true
		}
	},
	{
		path: '/game',
		component: Game,
		name: "game",
		meta: {
			requiresAuth: true,
			requiresInGame: true
		}
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
		next('/login')
	} else if (to.matched.some(record => record.meta.requiresNoUser)) {
		if (!store.getters.isLoggedIn) {
			next()
			return
		}
		next('/')
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