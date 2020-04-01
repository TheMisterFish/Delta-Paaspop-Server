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
			Vue.prototype.$socket = event.currentTarget
			state.socket.isConnected = true
		},
		SOCKET_ONCLOSE(state) {
			state.socket.isConnected = false
		},
		SOCKET_ONERROR(state, event) {
			console.log("SOCKET_ONERROR");
			console.error(state, event)
		},
		// default handler called for all methods
		SOCKET_ONMESSAGE(state, message) {
			console.log("message: ", message);
			state.socket.message = JSON.parse(message.data)
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
			console.log('sending: ', message);
			Vue.prototype.$socket.send(JSON.stringify(message))
			// .....
		}
	},
	getters: {
		isSocketConnected: state => !!state.socket.isConnected,
		socketMessage: state => state.socket.message,
		socketReconnectError: state => state.socket.reconnectError
	}
}

export default SocketStore;