<template>
  <div
    class="bg-image container"
    id="bg-image"
  >
    <div class="container">
      <div class="row">
        <div class="page_title">Inloggen</div>
      </div>
      <div class="row">
        <div class="card">
          <form @submit.prevent="login">
            <div class="card-body">
              <div class="form-group">
                <input
                  type="text"
                  name="email"
                  v-model="form.email"
                  id=""
                  placeholder="E-Mail adress"
                  :disabled="sending"
                >
                <label for="email">Vul je email adress in</label>
              </div>
              <div class="form-group">
                <input
                  type="password"
                  name="password"
                  v-model="form.password"
                  id=""
                  placeholder="Wachtwoord"
                  :disabled="sending"
                >
                <label for="password">Vul je email adress in</label>
              </div>
              <div class="">
                <button
                  type="submit"
                  class="btn button-primary center"
                >Login</button>
              </div>
              <div class="card-footer">
                Nog geen account?
                <router-link to="/register">Regristreren</router-link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="row">
        <div class="logo-outer">
          <img
            class="logo center"
            src="../../assets/logo.png"
            alt=""
          ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: null,
        password: null
      },
      sending: false,
      errorStatus: false
    };
  },
  computed: {
    authStatus: function() {
      return this.$store.getters.authStatus;
    }
  },
  methods: {
    clearForm() {
      this.$v.$reset();
      this.form.email = null;
    },
    login() {
      this.sending = true;
      var email = this.form.email;
      var password = this.form.password;
      this.$store
        .dispatch("login", { email, password })
        .then(() => {
          if (this.authStatus == "success") {
            this.sending = false;
            this.$router.push("/");
          } else {
            this.sending = false;
            this.form.password = "";
          }
        })
        .catch(err => {
          this.$store.dispatch("error", err);
        });
    },
    validateUser() {
      this.saveUser();
    }
  }
};
</script>

<style lang="scss" scoped>
#bg-image {
  background-image: url("./../../assets/backgrounds/login_bg.png");
  height: 100vh;
}
</style>
