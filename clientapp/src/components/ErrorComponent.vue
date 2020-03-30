<template>
  <div>
    <div class="errorToast">
      Error!
    </div>
  </div>
</template>

<script>
import { ErrorBus } from "../busses/ErrorBus.js";
export default {
  mounted() {
    ErrorBus.$on("Error", function(error) {
			// if(error.response.status == "404"){
			// 	// Kon server niet bereiken :(
			// } else if (error.response.status == ""){
			// 	// 
			// }
      console.log(error);
      console.log(error.status);
      console.log(error.headers);
    });
  }
  // methods: {
  // 	test(error1) {
  // 		console.log("ERROR!",error1);
  // 	}
  // },
};
</script>

<style lang="scss" scoped>
div {
  display: flex;
	justify-content: center;
	display: none;
}
.errorToast {
  position: absolute;
  width: 100vw;
  bottom: 0px;
  background-color: rgba($color: white, $alpha: 0.7);
  height: 50px;
}
</style>
