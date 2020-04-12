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
                <label for="password">Vul je wachtwoord in</label>
              </div>
              <div
                class="error-message"
                v-if="errorStatus"
              >
                {{ errorMessage }}
              </div>
              <div class="">
                <button
                  type="submit"
                  class="btn button-primary center"
                >Login</button>
              </div>
              <div class="card-footer">
                Nog geen account?
                <router-link to="/register">Registreren</router-link>
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
      errorStatus: false,
      errorMessage: null
    };
  },
  computed: {
    authStatus: function() {
      return this.$store.getters.authStatus;
    }
  },
  mounted() {},
  methods: {
    clearForm() {
      this.$v.$reset();
      this.form.email = null;
    },
    login() {
      this.sending = true;
      var email = this.form.email;
			var password = this.form.password;
			if(!email || !password){
				this.errorMessage = "Vul je emailadress en wachtwoord in";
				this.errorStatus = true;
				this.sending = false;
				return;
			}
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
        .catch(() => {
          this.sending = false;
          this.form.password = "";
          this.errorMessage = "Kon niet inloggen.";
          this.errorStatus = true;
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
  height: 100%;
}
.error-message {
  text-align: center;
  margin-bottom: 15px;
	margin-top: 2.5px;
	padding: 10px;
}
</style>
