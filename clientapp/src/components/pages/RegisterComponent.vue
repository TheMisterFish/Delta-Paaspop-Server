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
          <transition name="fade">
            <div
              class="content"
              v-if="show == 'register'"
            >
              <form @submit.prevent="register">
                <div class="card-body">
                  <div class="form-group">
                    <input
                      type="text"
                      name="email"
                      v-model="form.email"
                      id=""
                      placeholder="E-Mail adress"
                      :disabled="sending"
                      @blur="email_touched = true, email_exists = false"
                    >
                    <label
                      for="email"
                      v-if="!$v.form.email.required"
                    >Vul je e-mailadres in</label>
                    <label
                      for="email"
                      v-else-if="!$v.form.email.email && email_touched"
                    > Geen geldig e-mailadres</label>
                    <label
                      for="email"
                      v-else-if="email_exists && email_touched"
                    > E-mailadres bestaat al</label>
                    <label
                      for="email"
                      v-else-if="$v.form.email.required && $v.form.email.email"
                    >E-mail adress</label>
                    <label
                      for="email"
                      v-else
                    >Vul je e-mailadres in</label>

                  </div>
                  <div class="form-group">
                    <input
                      type="password"
                      name="password"
                      v-model="form.password"
                      id=""
                      placeholder="Wachtwoord"
                      :disabled="sending"
                      @blur="password_touched = true"
                    >
                    <label
                      for="password"
                      v-if="!$v.form.password.required"
                    >Vul je wachtwoord in</label>
                    <label
                      for="password"
                      v-else-if="!$v.form.password.minLength && password_touched"
                    >Minimaal 6 tekens</label>
                    <label
                      for="password"
                      v-else-if="$v.form.password.required && $v.form.password.minLength"
                    >Wachtwoord</label>
                    <label
                      for="password"
                      v-else
                    >Vul je wachtwoord in</label>
                  </div>
                  <div class="form-group">
                    <input
                      type="password"
                      name="password_repeat"
                      v-model="form.password_repeat"
                      id=""
                      placeholder="Wachtwoord herhalen"
                      :disabled="sending"
                      @blur="password_repeat_toucher = true"
                    >
                    <label
                      for="password"
                      v-if="!$v.form.password_repeat.required"
                    >Herhaal je wachtwoord</label>
                    <label
                      for="password"
                      v-else-if="!$v.form.password_repeat.sameAsPassword && password_repeat_toucher"
                    >Wachtwoord komt niet overeen</label>
                    <label
                      for="password"
                      v-else-if="$v.form.password_repeat.required && $v.form.password_repeat.sameAsPassword"
                    >Herhaald wachtwoord</label>
                    <label
                      for="password"
                      v-else
                    >Herhaal je wachtwoord</label>
                  </div>
                  <div class="form-group">
                    <span
                      class="reload"
                      @click="newNickname"
                    ></span>
                    <input
                      type="text"
                      name="nickname"
                      id=""
                      v-model="form.nickname"
                      disabled="disabled"
                      placeholder="bijnaam"
                    >
                    <label for="password">Kies een bijnaam</label>
                  </div>
                  <div class="agree">
                    <label class="checkbox_outer">
                      <input
                        type="checkbox"
                        v-model="form.terms"
                      >
                      <span class="checkmark"></span>
                    </label>
                    <div class="checkbox_text">
                      Ik ben het eens met de <a class="terms">termen en condities</a>
                    </div>
                  </div>
                  <div class="">
                    <button
                      class="btn button-primary center"
                      type="submit"
                      :disabled="sending"
                    >Regristreer</button>
                  </div>
                  <div class="card-footer">
                    Toch al een account?
                    <router-link to="/login">Aanmelden</router-link>
                  </div>
                </div>
              </form>
            </div>
          </transition>
          <transition name="fade">
            <div
              class="content"
              v-if="show == 'success'"
            >
              <div class="card-body">
                <h1>Je hebt als het goed is een e-mail gekregen.</h1>
                <div class="mail_icon ">
                  <span
                    class="mail slide-in-left"
                    v-if="show =='success'"
                  ></span>
                </div>
                <div class="card-footer">
                  <router-link to="/login">Aanmelden</router-link>
                </div>
              </div>
            </div>
          </transition>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AuthApi, UserApi } from "../../api";
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";
// const adminport = process.env.VUE_APP_ADMINPORT;

// function shouldNotExist() {
//   UserApi.emailCheck()
// }

export default {
  data() {
    return {
      form: {
        email: null,
        password: null,
        password_repeat: null,
        nickname: "",
        terms: false
      },
      sending: false,
      show: "register",
      email_touched: false,
      password_touched: false,
			password_repeat_toucher: false,
			email_exists: false
    };
  },
  validations: {
    form: {
      email: { required, email },
      password: { required, minLength: minLength(6) },
      password_repeat: { required, sameAsPassword: sameAs("password") },
      nickname: { required },
      terms: { required, sameAs: sameAs(() => true) }
    }
  },
  created() {
    UserApi.randomName()
      .then(data => {
        this.form.nickname = data;
      })
      .catch((this.form.nickname = ""));
  },
  methods: {
		delay(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		},
    newNickname() {
      UserApi.randomName()
        .then(data => {
          this.form.nickname = data;
        })
        .catch((this.form.nickname = ""));
    },
    register() {
      this.sending = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.sending = false;
        return;
      }
			var email = this.form.email;

			if(UserApi.emailCheck(email) == true){
				this.email_exists = true;
				return;
			}
      var password = this.form.password;
      var nickname = this.form.nickname;

      AuthApi.register({ email, password, nickname })
        .then(() => {
					this.show = "success";          
        })
        .catch((this.sending = false));
    }
  }
};
</script>

<style lang="scss" scoped>
#bg-image {
  background-image: url("./../../assets/backgrounds/register_bg.png");
  height: 100vh;
}
.btn {
  margin-top: 20px !important;
  text-decoration: none !important;
}
.agree {
  display: block;
  position: relative;
  margin-bottom: 30px;
}
.checkbox_outer {
  float: left;
  margin-top: 3px;
  width: 35px;
  height: 25px;
  position: relative;
  // padding-left: 35px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  // margin-bottom: 30px;
}
/* Hide the browser's default checkbox */
.checkbox_outer input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.terms {
  color: yellow;
  cursor: pointer;
  text-decoration: underline;
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

.reload {
  -webkit-mask: url("./../../assets/svg/reload.svg") no-repeat center;
  mask: url("./../../assets/svg/reload.svg") no-repeat center;
  display: inline-block;
  width: 25px;
  height: 25px;
  cursor: pointer;
  background-color: white;
  position: absolute;
  right: 5px;
  top: 8px;
}
.form-group {
  position: relative;
}

.shake-bottom {
  -webkit-animation: shake-bottom 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955)
    both;
  animation: shake-bottom 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
}

h1 {
  font-family: TTTunnels-Black;
  font-weight: bolder;
  text-align: center;
  text-transform: uppercase;
}
.mail_icon {
  text-align: center;
}
.mail {
  -webkit-mask: url("./../../assets/svg/mail.svg") no-repeat center;
  mask: url("./../../assets/svg/mail.svg") no-repeat center;
  display: inline-block;
  width: 200px;
  // margin-right: 60px;
  height: 50px;
  background-color: white;
}
.slide-in-left {
  -webkit-animation: slide-in-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    both;
  animation: slide-in-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

/* ----------------------------------------------
 * Generated by Animista on 2020-3-25 21:39:10
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */
/* ----------------------------------------------
 * Generated by Animista on 2020-3-25 22:14:54
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

@-webkit-keyframes slide-in-left {
  0% {
    -webkit-transform: translateX(-1000px);
    transform: translateX(-1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slide-in-left {
  0% {
    -webkit-transform: translateX(-1000px);
    transform: translateX(-1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}
@-webkit-keyframes shake-bottom {
  0%,
  100% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transform-origin: 50% 100%;
    transform-origin: 50% 100%;
  }
  10% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }
  20%,
  40%,
  60% {
    -webkit-transform: rotate(-4deg);
    transform: rotate(-4deg);
  }
  30%,
  50%,
  70% {
    -webkit-transform: rotate(4deg);
    transform: rotate(4deg);
  }
  80% {
    -webkit-transform: rotate(-2deg);
    transform: rotate(-2deg);
  }
  90% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }
}
@keyframes shake-bottom {
  0%,
  100% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transform-origin: 50% 100%;
    transform-origin: 50% 100%;
  }
  10% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }
  20%,
  40%,
  60% {
    -webkit-transform: rotate(-4deg);
    transform: rotate(-4deg);
  }
  30%,
  50%,
  70% {
    -webkit-transform: rotate(4deg);
    transform: rotate(4deg);
  }
  80% {
    -webkit-transform: rotate(-2deg);
    transform: rotate(-2deg);
  }
  90% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }
}
</style>
