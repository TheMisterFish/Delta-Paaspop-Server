<template>
  <div>
    <div class="status-container">
			<div class="status">
      <div
        class="status-inner"
        v-html="game_data.status"
      >
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
export default {
  props: {
    game_data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      interval: "",
      rotate: ""
    };
  },
  mounted() {
    this.interval = setInterval(
      function() {
        this.rotate = "rotate";
        setTimeout(() => {
          this.rotate = "";
        }, 2510);
      }.bind(this),
      10000
    );
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    animate() {}
  }
};
</script>

<style lang="scss" scoped>
/deep/ .game-title {
  color: $yellow;
  font-size: 38px;
}
.status-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
	flex-direction: column;
	flex-grow: 1;
}
.status {
  font-size: 40px;
  padding: 20px;
  font-family: TTTunnels-Black;
  color: white;
	text-align: center;
	flex-grow: 3;
	display: flex;
}
.status-inner{
	align-self: center;
}
.logo {
	flex-grow: 1;

  img {
		width: 80px;
		max-width: 30vw!important;
  }
}
</style>