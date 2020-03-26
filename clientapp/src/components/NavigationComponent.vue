<template>
  <div class="nav-outer">
		<router-link
      to="/account"
      class="nav-button-outer"
    >
      <div class="nav-button middle-button">
        <span
          class="account"
          :class="currentRouteName == 'account' ? 'active' : ''"
        ></span>
      </div>
    </router-link>
		
    <router-link
      to="/"
      class="nav-button-outer"
    >
      <div class="nav-button left-button">

        <span
          class="home"
          :class="currentRouteName == 'home' ? 'active' : ''"
        ></span>
      </div>
    </router-link>

    <router-link
      to="/leaderboard"
      class="nav-button-outer"
    >
      <div class="nav-button right-button">
        <span
          class="leaderboard"
          :class="currentRouteName == 'leaderboard' ? 'active' : ''"
        ></span>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "bottomNav",
  computed: {
    currentRouteName() {
      return this.$route.name;
    }
  },
};
</script>

<style lang="scss" scoped>
.nav-outer {
  height: $navHeight;
  position: absolute;
  bottom: 0px;
  z-index: 1000;
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
}
.nav-button-outer {
  flex-grow: 1;
  width: 33%;
  height: $navHeight;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-button {
  background-color: $dark;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    display: inline-block;
    width: 25px;
    height: 25px;
    cursor: pointer;
    background-color: white;
    &.active {
      background-color: $yellow;
    }
  }
}

.left-button {
  border-radius: 0px 7.5px 0px 0px;
}
.middle-button {
  border-radius: 7.5px 7.5px 0px 0px;
}
.right-button {
  border-radius: 7.5px 0px 0px 0px;
}

.home {
  -webkit-mask: url("./../assets/svg/home.svg") no-repeat center;
  mask: url("./../assets/svg/home.svg") no-repeat center;
}
.account {
  -webkit-mask: url("./../assets/svg/account.svg") no-repeat center;
  mask: url("./../assets/svg/account.svg") no-repeat center;
}
.leaderboard {
  -webkit-mask: url("./../assets/svg/leaderboard.svg") no-repeat center;
  mask: url("./../assets/svg/leaderboard.svg") no-repeat center;
}
</style>
