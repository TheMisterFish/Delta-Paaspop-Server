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
          <div class="card-body">
            <div class="form-group">
              <input
                type="text"
                name="username"
                id=""
                placeholder="E-Mail adress"
              >
              <label for="username">Vul je email adress in</label>
            </div>
            <div class="form-group">
              <input
                type="password"
                name="password"
                id=""
                placeholder="Wachtwoord"
              >
              <label for="password">Vul je email adress in</label>
            </div>
            <div class="">
              <button class="btn button-primary center">Login</button>
            </div>
            <div class="card-footer">
              Nog geen account?
              <router-link to="/register">Regristreren</router-link>
            </div>
          </div>
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
export default {};
</script>

<style lang="scss" scoped>
#bg-image {
  background-image: url("./../../assets/backgrounds/login_bg.png");
  height: 100vh;
}
</style>
