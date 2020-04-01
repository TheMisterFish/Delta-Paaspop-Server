<template>
  <div>
    <transition name="fade">
      <component :is="currentScreen"></component>
    </transition>
    {{SocketConnect}}
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
    }
  },
  data() {
    return {
      currentScreen: "StatusScreen",
      game: {}
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
    } else {
      this.game = this.$route.params.game;
      console.log("connecting?");
      this.$connect("ws://localhost:9000/game", {
        format: "json",
        protocol: "token:" + this.game.game_token,
        store: this.$store
      });
    }
    this.$options.sockets.onmessage = data => console.log(data);
  }
};
</script>

<style lang="scss" scoped>
</style>
