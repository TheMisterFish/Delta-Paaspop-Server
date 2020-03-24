<template>
  <div
    class="bg-image container"
    id="bg-image"
  >
    <div class="container">
      <div class="row">
        <div class="logo-outer">
          <img
            class="bigLogo center"
            src="../../assets/logo.png"
            alt=""
          >
        </div>
      </div>
      <div class="row">
        <div class="game-outer">
          <span
            class="game-status"
            v-if="false"
          >
            Geen spel gaande...
          </span>
          <div
            class="game-button"
            v-if="true"
          >
            <button
              class="start-btn"
              @click="test"
            >Speel mee</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  methods: {
    test() {
      axios
        .post("http://localhost:3000/api/test", {}, {
          withCredentials: true
        })
        .then(response => response.data);
    }
  }
};
</script>

<style lang="scss" scoped>
#bg-image {
  background-image: url("./../../assets/backgrounds/home_bg.png");
  height: 100vh;
}
.bigLogo {
  max-width: 50%;
}
.game-outer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.game-status {
  margin: 0 auto;
  text-align: center;
  font-size: 60px;
  width: 60%;
  display: block;
  font-family: TTTunnels-Black;
  line-height: 47px;
}
.game-button {
  margin-right: 10px;
}
.start-btn {
  background-color: $yellow;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  color: $dark;
  margin-left: 5px;
  margin-bottom: 5px;
  width: 200px;
  height: 200px;
  text-decoration: none;
  border: none;
  text-transform: uppercase;
  -webkit-transition: all 0.2s ease;
  -o-transition: all 0.2s ease;
  transition: all 0.2s ease;
  font-family: TTTunnels-Black;
  font-weight: bolder;
  font-size: 60px;
  -webkit-box-shadow: -5px 5px 0px 2px rgba(0, 0, 0, 1);
  -moz-box-shadow: -5px 5px 0px 2px rgba(0, 0, 0, 1);
  box-shadow: -5px 5px 0px 2px rgba(0, 0, 0, 1);
}

.start-btn:hover {
  text-transform: uppercase;
  -webkit-transition: all 0.2s ease;
  -o-transition: all 0.2s ease;
  transition: all 0.2s ease;
  margin-left: 4px;
  margin-bottom: 4px;
  -webkit-box-shadow: -4px 4px 0px 2px rgba(0, 0, 0, 1);
  -moz-box-shadow: -4px 4px 0px 2px rgba(0, 0, 0, 1);
  box-shadow: -4px 4px 0px 2px rgba(0, 0, 0, 1);
}
.start-btn:active {
  text-transform: uppercase;
  -webkit-transition: all 0.2s ease;
  -o-transition: all 0.2s ease;
  transition: all 0.2s ease;
  margin-left: -5px;
  margin-bottom: -5px;
  -webkit-box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 1);
  -moz-box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 1);
  box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 1);
}
.row {
  height: 50vh;
}
</style>
