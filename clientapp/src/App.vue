<template>
  <div
    id="app"
    v-touch:swipe="swipeHandler"
  >
    <transition
      :name="transitionName"
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
      transitionName: "fade"
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
    },
    swipeHandler(direction) {
      if (this.$route.name == "home" && direction == "right") {
        this.$router.push({ path: "/account" });
      } else if (this.$route.name == "home" && direction == "left") {
        this.$router.push({ path: "/leaderboard" });
      } else if (this.$route.name == "account" && direction == "left") {
        this.$router.push({ path: "/" });
      } else if (this.$route.name == "leaderboard" && direction == "right") {
        this.$router.push({ path: "/" });
      }
    }
  },
  watch: {
    $route(to, from) {
      let transitionName = this.transitionName;
      if (from.name == "home" && to.name == "leaderboard") {
        transitionName = "slide-left";
      } else if (from.name == "home" && to.name == "account") {
        transitionName = "slide-right";
      } else if (from.name == "account" && to.name == "leaderboard") {
        transitionName = "slide-left";
      } else if (from.name == "account" && to.name == "home") {
        transitionName = "slide-left";
      } else if (from.name == "leaderboard" && to.name == "account") {
        transitionName = "slide-right";
      } else if (from.name == "leaderboard" && to.name == "home") {
        transitionName = "slide-right";
      }
      this.transitionName = transitionName;
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
// @import('./assets/styles/transitions');
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.33s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: height, opacity;
  transition-timing-function: ease;
  overflow: hidden;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
