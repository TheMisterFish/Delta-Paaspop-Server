import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
console.log("LAODED");
const SocketStore = {
	state: {
		socket: {
			isConnected: false,
			message: '',
			reconnectError: false,
		}
	},
	mutations: {
		SOCKET_ONOPEN(state, event) {
			console.log("SOCKET_ONOPEN");
			Vue.prototype.$socket = event.currentTarget
			state.socket.isConnected = true
		},
		SOCKET_ONCLOSE(state, event) {
			console.log("SOCKET_ONCLOSE");
			console.log(event);
			state.socket.isConnected = false
		},
		SOCKET_ONERROR(state, event) {
			console.log("SOCKET_ONERROR");
			console.error(state, event)
		},
		// default handler called for all methods
		SOCKET_ONMESSAGE(state, message) {
			console.log("SOCKET_ONMESSAGE");
			state.socket.message = message
		},
		// mutations for reconnect methods
		SOCKET_RECONNECT(state, count) {
			console.log("SOCKET_RECONNECT");
			console.info(state, count)
		},
		SOCKET_RECONNECT_ERROR(state) {
			console.log("SOCKET_RECONNECT_ERROR");
			state.socket.reconnectError = true;
		},
	},
	actions: {
		sendMessage: function (context, message) {
			// .....
			console.log('sending');
			console.log(context);
			console.log(message);
			Vue.prototype.$socket.send(message)
			// .....
		}
	},
	getters: {
		isSocketConnected: state => !!state.socket.isConnected,  
	}
}

export default SocketStore;