<template>
  <div
    class="bg-image container"
    id="bg-image"
  >
    <div class="container">
      <div class="row">
        <div class="page_title">Account</div>
      </div>
      <div class="row">
        <div class="card">
          <div class="card-body">
            <div class="text-group">
              <div class="key">Email</div>
              <div class="value">JohnDoe@gmail.com</div>
            </div>
            <div class="text-group">
              <div class="key">Bijnaam</div>
              <div class="value">DeEnigePaashaas</div>
            </div>
            <div class="text-group">
              <div class="score_key">Score</div>
              <div class="score">512</div>
              <div class="score_text">PAASPOP PUNTEN</div>
            </div>
            <div class="text-group logout">
              <button
                class="btn"
                @click="logout"
              >Uitloggen</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch("logout");
    }
  }
};
</script>

<style lang="scss" scoped>
#bg-image {
  background-image: url("./../../assets/backgrounds/account_bg.png");
  height: 100vh;
}
.text-group {
  margin-bottom: 20px;
}
.value {
  font-family: "Montserrat";
  font-weight: lighter;
}
.score_key {
  font-family: "Montserrat";
  font-weight: bold;
}
.score {
  font-family: "Montserrat";
  font-weight: bolder;
  font-size: 100px;
  text-align: center;
  color: $yellow;
}
.score_text {
  float: right;
  margin-top: -28px;
  margin-right: 42.5px;
  font-family: TTTunnels-Black;
  font-weight: lighter;
  font-size: 20px;
  color: $yellow;
}
.logout {
  margin-top: 60px;
  text-align: center;
}
</style>
