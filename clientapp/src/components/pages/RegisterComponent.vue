<template>
  <div
    class="bg-image container"
    id="bg-image"
  >
    <div class="container">
      <div class="row">
        <div class="page_title">Regristreren</div>
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
              <label for="password">Vul je wachtwoord in</label>
            </div>
            <div class="form-group">
              <input
                type="password"
                name="password_repeat"
                id=""
                placeholder="Wachtwoord"
              >
              <label for="password">Herhaal je wachtwoord</label>
            </div>
            <div class="form-group">
              <input
                type="text"
                name="nickname"
                id=""
                placeholder="bijnaam"
              >
              <label for="password">Kies een bijnaam</label>
            </div>
            <div class="agree">
              <label class="checkbox_outer">One
                <input
                  type="checkbox"
                  checked="checked"
                >
                <span class="checkmark"></span>
                One</label>
            </div>
            <div class="">
              <button class="btn button-primary center">Regristreer</button>
            </div>
            <div class="card-footer">
              Toch al een account?
              <router-link to="/login">Aanmelden</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
#bg-image {
  background-image: url("./../../assets/backgrounds/register_bg.png");
  height: 100vh;
}

.checkbox_outer {
  display: block;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  margin-bottom: 30px;
}

/* Hide the browser's default checkbox */
.checkbox_outer input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 15px;
  width: 15px;
  border-style: solid;
  border-width: 3px;
  border-color: white;
  background-color: rgba($color: #000000, $alpha: 0);
}

/* On mouse-over, add a grey background color */
.checkbox_outer:hover input ~ .checkmark {
  border-style: solid;
  border-width: 3px;
  border-color: white;
  background-color: rgba($color: #000000, $alpha: 0);
}

/* When the checkbox is checked, add a blue background */
.checkbox_outer input:checked ~ .checkmark {
  border-style: solid;
  border-width: 3px;
  border-color: white;
  background-color: rgba($color: #000000, $alpha: 0);
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.checkbox_outer input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.checkbox_outer .checkmark:after {
  left: 0px;
  top: -15px;
  width: 15px;
  height: 30px;
  border: solid $yellow;
  border-width: 0 4px 4px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
