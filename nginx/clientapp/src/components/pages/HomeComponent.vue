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
          <transition name="fade">
            <span
              class="game-status"
              v-if="!game_found"
            >
              Geen spel gaande...
            </span>
            <div
              class="game-button"
              v-if="game_found && can_join"
            >
              <button
                class="start-btn"
                @click="startGame"
                :class="button_class"
              >Speel mee</button>
            </div>
            <span
              class="game-status"
              v-if="game_found && !can_join"
            >
              Kan niet meespelen
            </span>
          </transition>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { UserApi } from "../../api";

export default {
  data() {
    return {
      button_class: "",
      interval: undefined,
      game: {},
      game_found: false,
      can_join: true
    };
  },
  methods: {
    getStatus() {
      UserApi.game_status()
        .then(data => {
          if (data != false || data == undefined) {
            this.game = data;
            this.game_found = true;
            if (this.game.cannot_join) {
              this.can_join = false;
            } else {
							this.can_join = true;
              if (this.$store.getters.inGame == true) {
                this.$router.push({
                  name: "game",
                  params: { game: this.game }
                });
              }
            }
          } else {
            setTimeout(() => {
              this.game = {};
              this.game_found = false;
            }, 1000);
          }
        })
        .catch(() => {
          setTimeout(() => {
            this.game = {};
            this.game_found = false;
          }, 1000);
        });
    },
    startGame() {
			this.getStatus();
			if(this.can_join){
				this.button_class = "btn-pressed";
				setTimeout(() => {
					this.button_class = "";
					this.$router.push({ name: "game", params: { game: this.game } });
				}, 1000);
			}
    }
  },
  mounted: function() {
    this.getStatus();
    this.interval = setInterval(() => {
      this.getStatus();
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style lang="scss" scoped>
#bg-image {
  background-image: url("./../../assets/backgrounds/home_bg.png");
  height: 100%;
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
  text-transform: uppercase;
  position: absolute;
}
.game-button {
  margin-right: 10px;
  position: absolute;
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
.btn-pressed {
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
