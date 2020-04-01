<template>
  <div
    class="bg-image container"
    :id="'bg-image_'+background_id"
  >
    <div class="header-container">
      <span class="header">{{ header }}</span>
    </div>

    <div class="button-container">
      <div
        v-for="button in buttons"
        :key="button"
      >
        <div class="item">
          <button
            class="big-btn"
            @click="send(button)"
            :disabled="disableButtons"
            :class="buttonPressed == button ? 'big-btn-pressed' : ''"
          >
            {{ button }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    buttons: {
      type: Array,
      required: true
    },
    header: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return {
      background_id: 1,
      disableButtons: false,
      buttonPressed: null
    };
  },
  mounted() {
    this.background_id = Math.floor(Math.random() * 3) + 1;
  },
  methods: {
    send(button) {
      console.log(button);
      this.disableButtons = true;
      this.buttonPressed = button;
      let data = JSON.stringify({
        user: this.$store.getters.user.nickname,
        answer: button
      });
      // let json = JSON.stringify(data)
      // let send = "{'user':'"+this.$store.getters.user.nickname+"','answer':'"+button+"'}"
      this.$store.dispatch("sendMessage", { data });
    }
  }
};
</script>

<style lang="scss" scoped>
#bg-image_1 {
  background-image: url("./../../assets/backgrounds/game_bg_1.png");
  height: 100vh;
}
#bg-image_2 {
  background-image: url("./../../assets/backgrounds/game_bg_2.png");
  height: 100vh;
}
#bg-image_3 {
  background-image: url("./../../assets/backgrounds/game_bg_3.png");
  height: 100vh;
}

.item {
  width: 100%;
  padding: 10px;
}

.button-container {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
}

.header-container {
  height: 25%;
  font-family: TTTunnels-Black;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  justify-content: center;
}
.header {
  margin: auto;
  font-size: 40px;
  padding: 20px;
}

.button-container > div {
  flex: 1 0 50%;
}

.big-btn {
  background-color: $yellow;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  color: $dark;
  margin-left: 5px;
  margin-bottom: 5px;
  width: 130px;
  height: 130px;
  text-decoration: none;
  border: none;
  text-transform: uppercase;
  -webkit-transition: all 0.2s ease;
  -o-transition: all 0.2s ease;
  transition: all 0.2s ease;
  font-family: TTTunnels-Black;
  font-weight: bolder;
  font-size: 40px;
  -webkit-box-shadow: -5px 5px 0px 2px rgba(0, 0, 0, 1);
  -moz-box-shadow: -5px 5px 0px 2px rgba(0, 0, 0, 1);
  box-shadow: -5px 5px 0px 2px rgba(0, 0, 0, 1);
}

.big-btn-pressed {
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
</style>
