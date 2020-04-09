<template>
  <div>
    <transition name="fade">
      <component
        :is="currentScreen"
        :game_data="game_data"
        :key="componentKey"
        ref="actionRef"
      ></component>
    </transition>

    <button
      class="exitButton btn"
      @click="showExitModal"
    >
      EXIT
    </button>

    <transition name="fade">
      <div
        class="exitModal card"
        v-if="showExit"
      >
        <div class="card-body">
          Weet je zeker dat je wilt stoppen?

        </div>
        <div class=" card-footer">
          <button
            class="btn"
            @click="stopGame"
          >Ja</button> <button
            class="btn"
            @click="hideExitModal"
          >Nee</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ExitingScreen from "./ExitingScreen";
import ButtonsScreen from "./ButtonsScreen";
import StatusScreen from "./StatusScreen";

import {
	ActionBus
} from '../../busses/ActionBus';

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
      },
      showExit: false,
    };
  },
  components: {
    ButtonsScreen,
    ExitingScreen,
    StatusScreen
  },
  mounted() {
    if (!this.$route.params.game && !this.$store.getters.inGame) {
      this.stopGame()
    } else if (this.$route.params.game) {
      this.game = this.$route.params.game;
      this.$connect("ws://"+location.hostname+":9000/", {
        protocol: "token." + this.game.game_token,
        store: this.$store
      });
			this.$store.dispatch("joinGame", this.game);
    } else if (this.$store.getters.inGame) {
      this.game = this.$store.getters.game;
      this.$connect("ws://"+location.hostname+":9000/", {
        protocol: "token." + this.game.game_token,
        store: this.$store
      });
    }
    if (this.game.round_started == true) {
      this.game_data.status =
        "Wachten op input van <div class='game-title'>" +
        this.game.game_name +
        "</div>";
    } else {
      this.game_data.status =
        "Wachten tot het spel <div class='game-title'>" +
        this.game.game_name +
        "</div> gaat starten";
    }
  },
  destroyed() {
    if (this.$socket) this.$socket.close();
  },
  methods: {
    stopGame() {
      this.$store.dispatch("exitGame");
      this.$disconnect();
      this.$router.push("/");
    },
    showExitModal() {
      this.showExit = true;
    },
    hideExitModal() {
      this.showExit = false;
    },
  },
  watch: {
    SocketConnect(connected) {
      if (!connected) {
				this.$store.dispatch("exitGame");
        this.$router.push("/");
      } else {
        let data = {
          userJoined: {
            nickname: this.$store.getters.user.nickname,
            id: this.$store.getters.user.id
          }
        };
        this.$store.dispatch("sendMessage", { data });
      }
    },
    SocketMessage(message) {
      if ("buttons" in message) {
        this.game_data.buttons = message.buttons;
        this.componentKey = this.componentKey + 1;
        this.currentScreen = "ButtonsScreen";
        this.game_data.answer = null;
      }
      if ("status" in message) {
        this.game_data.status = message.status;
			}
			if ("userStatus" in message) {
				let me = this.$store.getters.user.nickname;
        if (message.userStatus[0] == me) {
					this.game_data.status = message.userStatus[1];
				}
      }
      if ("header" in message) {
        this.game_data.header = message.header;
      }
      if ("action" in message) {
				ActionBus.$emit('action', message.action)
        this.game_data.action = message.action;
      }
      if ("answer" in message) {
        this.game_data.answer = message.answer;
      }
      if ("userHeader" in message) {
        let me = this.$store.getters.user.nickname;
        if (message.userHeader[0] == me) {
          this.game_data.header = message.userHeader[1];
        }
      }
      if ("stopGame" in message && message.stopGame == true) {
        this.stopGame();
      }
      if ("switchScreen" in message) {
        let screen = message.switchScreen;
        switch (screen) {
          case "buttons":
            this.componentKey = this.componentKey + 1;
            this.currentScreen = "ButtonsScreen";
            break;
          case "exit":
            this.componentKey = this.componentKey + 1;
            this.currentScreen = "ExitingScreen";
            break;
          case "status":
            this.componentKey = this.componentKey + 1;
            this.currentScreen = "StatusScreen";
            break;
          default:
            break;
        }
      }
    },
    SocketReconnectError(reconnectError) {
      console.log("Reconnect error: ", reconnectError);
    }
  }
};
</script>

<style lang="scss" scoped>
.exitButton {
  position: absolute;
  bottom: 5px;
  left: 5px;
  font-size: 1rem;
  padding: 1px 20px;
}
.exitModal {
  position: absolute;
  top: 10%;
  color: white;
  background-color: $blue;
  min-height: 0px;
}
.card-body {
  font-size: 2rem;
  text-align: center;
  font-family: TTTunnels-Black;
}
</style>
