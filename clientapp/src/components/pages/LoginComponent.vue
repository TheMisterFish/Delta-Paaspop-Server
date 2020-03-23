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
						<div class="signup">
							Nog geen account? <a href="/register">Regristreren</a>
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
  background-image: url("./../../assets/backgrounds/login_bg.png");
  height: 100vh;
}
.card {
  background-color: $dark;
  margin: 0 auto;
  padding: 20px;
  margin: 10px 30px 10px 30px;
  min-height: 200px;
  .card-body {
    width: 100%;
    margin: 20px auto;
    .form-group {
      margin-bottom: 20px;
      text-align: center;
      label {
				margin-top: 5px;
				margin-bottom: 10px;
				display: inline-block;
				font-family: "Montserrat-Thin";
				font-weight: bold;
        color: white;
      }
      input {
				line-height: normal;
        width: 100%;
        padding: 12px 10px;
        background-color: $blue;
        border: none;
        color: white;
        font-size: 14px;
        font-weight: bold;
				box-sizing: border-box;
				font-family: "Montserrat-Thin";
				font-weight: lighter;
				font-size: 14px;
			}
			::placeholder{
				color: white;
				opacity: 1;
        text-transform: uppercase;
				font-family: "TTTunnels-Black";
				font-weight: lighter;
			}
    }
  }
}
.center{
	display: block;
  margin-left: auto;
  margin-right: auto;
}

.signup{
	margin-top: 30px;
	font-weight: bolder;
	text-align: center;
	a{
		color: $yellow;
	}
}
</style>
