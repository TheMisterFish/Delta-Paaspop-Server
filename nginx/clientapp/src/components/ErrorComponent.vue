<template>
  <div>
    <transition name="fade">
      <div
        v-if="error"
        class="outer"
      >
        <div class="errorToast">
          <div class="closeOuter">
            <span @click="closeError">✕</span>
          </div>

          <div class="error">
            <span class="errorCode">
              {{ status }}
            </span>
            <div class="errorText">
              {{ message }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ErrorBus } from "../busses/ErrorBus.js";
export default {
  data() {
    return {
      status: 500,
      message: "",
      error: false
    };
  },
  mounted() {
    ErrorBus.$on("Error", error => {
      if (error.response.status) {
        this.showError(error.response.status);
      } else if (error.status) {
        this.showError(error.status);
      } else {
        this.showError(500);
      }
    });
  },
  methods: {
    showError(error) {
      if (error == "404") {
        this.message = "Er was een probleem met het bereiken van de server.";
        this.status = 404;
        this.error = true;
        setTimeout(
          function() {
            this.error = false;
          }.bind(this),
          10000
        );
      } else if (error == "500") {
        this.message = "Er was een probleem met de server.";
        this.status = 500;
        this.error = true;
        setTimeout(
          function() {
            this.error = false;
          }.bind(this),
          10000
        );
      } else if (error == "401") {
				this.$store.dispatch("exitGame");
				this.$store.dispatch("errorLogout");
				this.$router.push("/login");
      }
    },
    closeError() {
      this.error = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.outer {
  z-index: 10000;
  position: absolute;
  top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.errorToast {
  width: 100%;
  height: 100%;
  background-color: rgba($color: $yellow, $alpha: 0.95);
  border-radius: 10px;
  width: 80vw;
  .closeOuter {
    text-align: right;
    display: block;
    height: 10px;
    span {
      padding-left: 10px;
      padding-right: 10px;
      cursor: pointer;
      height: 25px;
      display: inline-block;
      z-index: 100000;
    }
  }
}
.error {
  height: 50px;
  pointer-events: none;
  display: flex;
  .errorCode {
    width: 30%;
    display: inline-block;
    font-size: 45px;
    font-family: TTTunnels-Black;
		text-transform: uppercase;
    padding-top: 0px;
    padding-left: 5px;
    padding-right: 5px;
    color: rgb(44, 44, 44);
  }
  .errorText {
    display: inline-block;
    padding: 5px;
    font-family: Montserrat-Thin;
    font-weight: bolder;
  }
}
</style>
