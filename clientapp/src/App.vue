<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

export default {
	name: 'App',
	data() {
		return {
			transitionName: "slide-right"
		}
	},
	watch: {
  '$route' (to, from) {
    console.log(to, from);
  }
}
}
</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
