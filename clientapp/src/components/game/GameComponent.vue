<template>
  <div>
    <transition name="fade">
      <component :is="currentScreen"></component>
      hoi
    </transition>
  </div>
</template>

<script>
import ExitingScreen from "./ExitingScreen";
import ButtonsScreen from "./ButtonsScreen";
import StatusScreen from "./StatusScreen";

import Vue from "vue";
import VueNativeSock from "vue-native-websocket";
Vue.use(VueNativeSock, "ws://localhost:9000", {
  connectManually: true
});
const vm = new Vue();

export default {
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
      vm.$connect("ws://localhost:9000/game", {
        format: "json",
        protocol: "token:" + this.game.game_token,
      });
    }
    this.$options.sockets.onmessage = data => console.log(data);
  }
};
</script>

<style lang="scss" scoped>
</style>
