<template>
  <div id="app">
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view></router-view>
    </transition>
    <div v-if="isLoggedIn">
      <bottom-nav></bottom-nav>
    </div>
  </div>
</template>

<script>
import bottomNav from "./components/NavigationComponent.vue";

export default {
  name: "App",
  components: {
    bottomNav
  },
  data() {
    return {
      transitionName: "slide-right"
    };
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },
    errorMessage: function() {
      return this.$store.getters.ErrorMsg;
    },
    hasError: function() {
      return this.$store.getters.hasError;
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.go();
      });
    },
    okError: function() {
      this.$store.dispatch("okError");
    }
  },
  watch: {
    $route(to, from) {
      console.log(to, from);
    }
  }
};
</script>

<style lang="scss">
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
