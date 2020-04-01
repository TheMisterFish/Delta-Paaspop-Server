<template>
  <div>
    <transition name="fade">
      <component :is="currentScreen" :buttons="game_data.buttons" :header="game_data.header"></component>
    </transition>
    {{SocketConnect}}
		{{SocketMessage}}
  </div>
</template>

<script>
import ExitingScreen from "./ExitingScreen";
import ButtonsScreen from "./ButtonsScreen";
import StatusScreen from "./StatusScreen";

export default {
  computed: {
    SocketConnect: function() {
      return this.$store.getters.isSocketConnected;
    },
    SocketMessage: function() {
      return this.$store.getters.socketMessage;
    },
    SocketReconnectError: function() {
      return this.$store.getters.socketReconnectError;
    }
  },
  data() {
    return {
      currentScreen: "ButtonsScreen",
			game: {},
			game_data: {
				buttons: [],
				status: "",
				header: ""
			}
    };
  },
  components: {
    ButtonsScreen,
    ExitingScreen,
    StatusScreen
  },
  mounted() {
    if (!this.$route.params.game && !this.$store.getters.inGame) {
      this.$router.push("/");
    } else if(this.$route.params.game) {
      this.game = this.$route.params.game;
      this.$connect("ws://localhost:9000/", {
        protocol: "token:" + this.game.game_token,
				store: this.$store,
      });
    } else if(this.$store.getters.inGame) {
			this.game = this.$store.getters.game;
      this.$connect("ws://localhost:9000/", {
        protocol: "token:" + this.game.game_token,
				store: this.$store,
      });
		}
  },
  destroyed() {
    if (this.$socket) this.$socket.close();
  },
  watch: {
    SocketConnect(connected) {
      console.log("Connected: ", connected);
      if (connected) {
        this.$store.dispatch("joinGame", this.game);
      }
    },
    SocketMessage(message) {
			console.log("Message: ", message	);
			if(message.buttons){
				this.game_data.buttons = message.buttons;
			}
			if(message.status){
				this.game_data.status = message.status;
			}
			if(message.header){
				this.game_data.header = message.header;
			}
    },
    SocketReconnectError(reconnectError) {
      console.log("Reconnect error: ", reconnectError);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
