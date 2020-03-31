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
import WaitingScreen from "./WaitScreen";

import Vue from "vue";
import VueNativeSock from "vue-native-websocket";
Vue.use(VueNativeSock, "ws://localhost:9090", {
	connectManually: true,
});

export default {
  data() {
    return {
      currentScreen: "WaitingScreen"
    };
  },
  components: {
    ButtonsScreen,
    ExitingScreen,
    WaitingScreen
  },
  mounted() {
		console.log("KAAS");
		console.log('route', this.$route.params.game);
		if(!this.$route.params.game && !this.$store.getters.inGame){
			this.$router.push("/");
		}
    this.$options.sockets.onmessage = data => console.log(data);
  }
};
</script>

<style lang="scss" scoped>

</style>
