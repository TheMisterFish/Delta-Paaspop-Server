var current = "";
function autoReload(reload) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			let response = this.responseText;
			
			if (response != "false") {
				response = {
					roundStart: JSON.parse(response).roundStarted
				}
			}
			if (typeof response === 'object') {
				if(typeof current != 'object' && reload == true){
					current = response;
					location.reload();
				} else if(response.roundStart != current.roundStart){
					current = response;
					if (reload == true) {
						location.reload();
					}
				}
			} else {
				if(response != current){
					current = response;
					if(reload == true){
						location.reload();
					}
				}
			}
		}
	};
	xhttp.open("GET", "/game/currently", true);
	xhttp.send();
}

autoReload(false)
setInterval(() => {
	autoReload(true)
}, 10000);