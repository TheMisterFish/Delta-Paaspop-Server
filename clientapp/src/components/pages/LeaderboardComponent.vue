<template>
  <div
    class="bg-image container"
    id="bg-image"
  >
    <div class="container">
      <div class="row">
        <div class="page_title">Leaderboard</div>
      </div>
      <div class="row">
        <div class="card">
          <div class="card-body">
            <table align="left">
              <thead>
                <tr>
                  <th class="position"></th>
                  <th class="user">Gebruiker</th>
                  <th class="last">Score</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="users.length == 0">Geen gebruikers gevonden</tr>
                <tr
                  v-else
                  v-for="(user, index) in users"
                  :key="index"
                >
                  <td :class="user.nickname == me.nickname ? 'bold' : ''"  class="position">{{index + 1}}</td>
                  <td :class="user.nickname == me.nickname ? 'bold' : ''" class="user">{{user.nickname}}</td>
                  <td :class="user.nickname == me.nickname ? 'bold' : ''"  class="last">{{user.points}}</td>
                </tr>
              </tbody>
            </table>
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
      users: [],
			me: this.$store.getters.user,
    };
  },
  mounted() {
    UserApi.leaderboard().then(data => {
      this.users = data.data;
    }).catch((err)=>{
			console.log(err);
		});
  }
};
</script>

<style lang="scss" scoped>
$maxHeight: calc(100vh - 140px - #{$navHeight});
#bg-image {
  background-image: url("./../../assets/backgrounds/leaderboard_bg.png");
  height: 100vh;
}
.card {
  height: $maxHeight;
  padding-top: 5px;
}
.card-body {
  height: 100%;
}

.bold{
	font-family: Montserrat;
	font-weight: bold;
}
table {
  text-align: left;

  .position {
    width: 15%;
  }
  .user {
    width: 65%;
  }
  .last {
    text-align: right;
    padding-right: 5%;
  }
}

thead {
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-color: white;
  margin-bottom: 5px;
  font-family: "Montserrat";
  font-weight: bolder;
}
table {
  position: relative;
  height: 100%;
  width: 100%;
  text-align: left;
  border-collapse: collapse;
}

table tbody {
  display: block;
  max-height: calc(#{$maxHeight} - 40px);
  overflow-y: scroll;
}

table thead,
tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
  td {
    border-bottom: 0.25px solid white;
    padding-top: 7.5px;
		word-wrap: break-word;         /* All browsers since IE 5.5+ */
    overflow-wrap: break-word;     /* Renamed property in CSS3 draft spec */
  }
}
</style>
