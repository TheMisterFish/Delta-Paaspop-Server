<template>
  <div>
    <div class="status-container">
      <div
        class="status"
        v-html="game_data.status"
      >
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
  justify-content: space-evenly;
  height: 100vh;
	flex-direction: column;
}
.status {
  font-size: 40px;
  padding: 20px;
  font-family: TTTunnels-Black;
  color: white;
  text-align: center;
}
.logo {
  img {
    width: 100px;
  }
}

.rotate {
  animation: rotateFrames ease 2.5s;
  animation-iteration-count: 1;
  transform-origin: 50% 50%;
  -webkit-animation: rotateFrames ease 2.5s;
  -webkit-animation-iteration-count: 1;
  -webkit-transform-origin: 50% 50%;
  -moz-animation: rotateFrames ease 2.5s;
  -moz-animation-iteration-count: 1;
  -moz-transform-origin: 50% 50%;
  -o-animation: rotateFrames ease 2.5s;
  -o-animation-iteration-count: 1;
  -o-transform-origin: 50% 50%;
  -ms-animation: rotateFrames ease 2.5s;
  -ms-animation-iteration-count: 1;
  -ms-transform-origin: 50% 50%;
}

@keyframes rotateFrames {
  0% {
    transform: rotate(0deg);
  }
  6% {
    transform: rotate(20deg);
  }
  17% {
    transform: rotate(-80deg);
  }
  77% {
    transform: rotate(1140deg);
  }
  86% {
    transform: rotate(1060deg);
  }
  92% {
    transform: rotate(1090deg);
  }
  100% {
    transform: rotate(1080deg);
  }
}

@-moz-keyframes rotateFrames {
  0% {
    -moz-transform: rotate(0deg);
  }
  6% {
    -moz-transform: rotate(20deg);
  }
  17% {
    -moz-transform: rotate(-80deg);
  }
  77% {
    -moz-transform: rotate(1140deg);
  }
  86% {
    -moz-transform: rotate(1060deg);
  }
  92% {
    -moz-transform: rotate(1090deg);
  }
  100% {
    -moz-transform: rotate(1080deg);
  }
}

@-webkit-keyframes rotateFrames {
  0% {
    -webkit-transform: rotate(0deg);
  }
  6% {
    -webkit-transform: rotate(20deg);
  }
  17% {
    -webkit-transform: rotate(-80deg);
  }
  77% {
    -webkit-transform: rotate(1140deg);
  }
  86% {
    -webkit-transform: rotate(1060deg);
  }
  92% {
    -webkit-transform: rotate(1090deg);
  }
  100% {
    -webkit-transform: rotate(1080deg);
  }
}

@-o-keyframes rotateFrames {
  0% {
    -o-transform: rotate(0deg);
  }
  6% {
    -o-transform: rotate(20deg);
  }
  17% {
    -o-transform: rotate(-80deg);
  }
  77% {
    -o-transform: rotate(1140deg);
  }
  86% {
    -o-transform: rotate(1060deg);
  }
  92% {
    -o-transform: rotate(1090deg);
  }
  100% {
    -o-transform: rotate(1080deg);
  }
}

@-ms-keyframes rotateFrames {
  0% {
    -ms-transform: rotate(0deg);
  }
  6% {
    -ms-transform: rotate(20deg);
  }
  17% {
    -ms-transform: rotate(-80deg);
  }
  77% {
    -ms-transform: rotate(1140deg);
  }
  86% {
    -ms-transform: rotate(1060deg);
  }
  92% {
    -ms-transform: rotate(1090deg);
  }
  100% {
    -ms-transform: rotate(1080deg);
  }
}
</style>