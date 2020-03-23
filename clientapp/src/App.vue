<template>
  <div id="app">
		<router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
	@import './assets/styles/paaspop_styling.css';
	#app {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}
</style>
