<template>
  <div>
    <div class="status-container">
      <div class="status">
        <div class="status-inner">
					<span class="code">404</span>
					<br>
					PAGINA NIET 
					<br>
					GEVONDEN
        </div>
      </div>

      <div class="logo">
        <img
          src="../../assets/logo.png"
          alt=""
          :class="rotate"
          srcset=""
        >
      </div>
    </div>

  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>

.status-container {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: 100vh;
  flex-direction: column;
}
.code{
	font-size: 110px;
	color: $yellow;
}
.status {
  font-size: 40px;
  padding: 20px;
  font-family: TTTunnels-Black;
  color: white;
  text-align: center;
  flex-grow: 2;
  display: flex;
}
.status-inner {
  align-self: center;
}

.logo {
	flex-grow: 1;
  img {
		width: 100px;
		max-width: 40vw!important;
		rotate: 180deg;
  }
}
</style>
