// Start a game
function start_game(game_id = false) {
	var url = "/game/start";
	if (!game_id || game_id == "null") {
		openDanger("Game id is null?", 4000)
		return false
	}
	let json = JSON.stringify({
		game_id: game_id,
	});

	console.log("start", game_id);
	var request = new XMLHttpRequest();
	request.open('POST', url, true);
	request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	request.onload = function () { // request successful
		openSuccess(request.responseText, 4000)
		setTimeout(() => {
			location.reload();
		}, 4000);
	};
	request.onerror = function (err) {
		openDanger(err, 4000)
	};

	request.send(json);
	event.preventDefault();
}
// Get game data
function getGameData() {
	console.log("Checking websocket connection...");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(this.responseText);

		}
	};
	xhttp.open("GET", "/game/currently", true);
	xhttp.send();
}

//Stop a game
function stop_game() {
	var url = "/game/stop";
	var request = new XMLHttpRequest();
	request.open('POST', url, true);
	request.onload = function () {
		if (request.status == 200){
			openSuccess(request.responseText, 4000)
			setTimeout(() => {
				location.reload();
			}, 4000);
		}
		if (request.status == 500)
			openDanger(request.responseText, 5000)
	};
	request.onerror = function (err) {
		openDanger(err, 10000)
	};
	request.send();
	event.preventDefault();
}

function start_round(){
	console.log("starting round");
	var url = "/game/admin_round_start";
	var request = new XMLHttpRequest();
	request.open('POST', url, true);
	request.onload = function () {
		if (request.status == 200){
			openSuccess(request.responseText, 4000)
			setTimeout(() => {
				location.reload();
			}, 4000);
		}
		if (request.status == 500)
			openDanger(request.responseText, 5000)
	};
	request.onerror = function (err) {
		openDanger(err, 10000)
	};
	request.send();
	event.preventDefault();
}