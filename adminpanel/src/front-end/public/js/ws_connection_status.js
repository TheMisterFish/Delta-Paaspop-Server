function loadDoc() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(this.responseText);
			document.getElementById("admin_channel").innerHTML = response['admin'] == true ? "Online ✔" : "Offline ✘";
			document.getElementById("game_channel").innerHTML = response['game'] == true ? "Online ✔" : "Offline ✘";
			setTimeout(loadDoc, 10000);
		}
	};
	xhttp.open("GET", "/ws/connected", true);
	xhttp.send();
}
loadDoc()