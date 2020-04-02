<template>
  <div>
    <transition name="fade">
      <component
        :is="currentScreen"
        :game_data="game_data"
				:key="componentKey"
      ></component>
    </transition>
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
			currentScreen: "StatusScreen",
			componentKey: 0,
      game: {},
      game_data: {
        buttons: [],
        status: "Wachten tot spel start",
        header: "",
        action: "",
        answer: null
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
    } else if (this.$route.params.game) {
      this.game = this.$route.params.game;
      this.$connect("ws://localhost:9000/", {
        protocol: "token:" + this.game.game_token,
        store: this.$store
      });
    } else if (this.$store.getters.inGame) {
      this.game = this.$store.getters.game;
      this.$connect("ws://localhost:9000/", {
        protocol: "token:" + this.game.game_token,
        store: this.$store
      });
		}
		this.game_data.status = "Wachten tot het spel <div class='game-title'>"+ this.game.game_name +"</div> gaat starten"
  },
  destroyed() {
    if (this.$socket) this.$socket.close();
  },
  watch: {
    SocketConnect(connected) {
      console.log("Connected: ", connected);
      if (connected) {
        this.$store.dispatch("joinGame", this.game);
      } else {
        this.$router.push("/");
      }
    },
    SocketMessage(message) {
      if ("buttons" in message) {
				this.game_data.buttons = message.buttons;
				this.componentKey = this.componentKey + 1;
				this.currentScreen = "ButtonsScreen";
				this.game_data.anser = null;
      }
      if ("status" in message) {
        this.game_data.status = message.status;
      }
      if ("header" in message) {
        this.game_data.header = message.header;
      }
      if ("action" in message) {
        this.game_data.action = message.action;
      }
      if ("answer" in message) {
        this.game_data.answer = message.answer;
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
