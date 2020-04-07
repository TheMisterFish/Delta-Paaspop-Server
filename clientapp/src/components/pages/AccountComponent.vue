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
              <div class="value">{{user.email}}</div>
            </div>
            <div class="text-group">
              <div class="key">Bijnaam</div>
              <div class="value">{{user.nickname}}</div>
            </div>
            <div class="text-group">
              <div class="score_key">Score</div>
              <div
                class="score"
                :class="error ? 'smallerfont' : ''"
              >{{points}}</div>
              <div
                class="score_text"
                :class="error ? 'hidden' : ''"
              >PAASPOP PUNTEN</div>
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
import { UserApi } from "../../api";
export default {
  data() {
    return {
      user: this.$store.getters.user,
      points: 0,
      error: false
    };
  },
  mounted() {
    UserApi.points()
      .then(data => {
        this.points = data.points;
      })
      .catch(() => {
        this.error = true;
        this.points = "ERROR";
      });
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
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
  .smallerfont {
    font-size: 60px !important;
  }
  .hidden {
    display: none;
  }
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
