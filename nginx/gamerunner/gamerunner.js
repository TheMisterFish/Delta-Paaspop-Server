const wsgametoken = "klw0xrls0yHEmvdyZnWhrRRCsEjlD7mk";
const pointstoken = "CJ3avghqang2OY22YE6ca6ikwzzdk6mP";
const logMessages = true;
const debugMode = true;
const socketurl = "ws://" + location.hostname + ":9000";

var socket;
var footerEnabled = true;
var state = 0;

var $transitionOpen, $transitionClose;

var grinit = function () {
	$transitionOpen = document.getElementById('gr-transition-open');
	$transitionClose = document.getElementById('gr-transition-close');
}

function connect() {
	log("Websocket: initializing....");

	closeConnection();

	log("Websocket: opening connection to '" + socketurl + "'....");

	this.socket = new WebSocket(socketurl, "token." + wsgametoken);

	registerEventListeners(this.socket);
}

var registerEventListeners = function (socket) {
	socket.addEventListener('error', function (event) {
		wsError(event.data);
	});

	socket.addEventListener('close', function (event) {
		wsClose();
	});

	socket.addEventListener('open', function (event) {
		wsOpen();
	});

	socket.addEventListener('message', function (event) {
		wsMessage(event);
	});
}

var wsMessage = function (event) {
	let message = event.data;
	log("Raw message received: " + message);

	let messageJSON = JSON.parse(message);
	log("JSON message: " + messageJSON);

	if (messageJSON.data != null &&
		messageJSON.data.user != null &&
		messageJSON.data.answer != null &&
		messageJSON.data.id != null) {

		let nickname = messageJSON.data.user;
		let answer = messageJSON.data.answer;
		let userid = messageJSON.data.id;

		userInput(nickname, userid, answer);
	} else if (messageJSON.stopGame != null) {
		forceStop();
	} else if (messageJSON.startGame != null) {
		let game = messageJSON.startGame;

		loadGame(game);
	}
}

var wsOpen = function () {
	log('Websocket: connection opened');
}

var wsClose = function () {
	log('Websocket: connection closed');
}

var wsError = function (error) {
	log('Websocket: websocket error! ' + error);
}

/**
 * Send data to websockets
 * Returns true if message successfully sent
 * @param {string} data 
 */
var wsSendData = function (data) {
	let sent = false;
	try {
		socket.send(data);
		sent = true;
		log("Websocket: sent message '" + data + "'");
	} catch (error) {
		log("Websocket: failed to send message '" + data + "' due to the following error: " + error);
	}
	return sent;
}





var closeConnection = function () {
	if (this.socket != null) {
		log("Gamerunner: Closing websocket connection...");
		this.socket.close();
		log("Gamerunner: Closed websocket connection");
	}
}

/**
 * Called by websockets
 * Start game
 * name has to be same as html file without extension
 * @param {String} name 
 */
var startGame = function (name) {
	loadGame(name + ".html");
}

/**
 * Called by websockets
 * Sends user input to game
 * @param {String} user nickname
 * @param {int} userId id of user
 * @param {int} data button pressed
 */
var userInput = function (user, userId, data) {
	try {
		gameUserInput(user, userId, data);
	} catch (error) {
		log("Gamerunner: sent data '" + data + "' from user '" + user + "'(" + userId + ") to game, but noones listening :(");
	}
}

/**
 * Called by game
 * Sends answer to all users
 */
function sendAnswer(answer) {
	let data = {
		answer: answer
	};
	let dataJSON = JSON.stringify(data);

	wsSendData(dataJSON);
}

/**
 * Called by game
 * Send custom outcome to user ie position
 */
function userResultCustom(userid, result) {

	// Ask vincent if possible
	let data = {
		data: "result-custom",
		result: result,
		userid: userid
	};
	let dataJSON = JSON.stringify(data);

	wsSendData(dataJSON);
}

/**
 * Called by game
 * Lets clients know next round has started, and show buttons given
 * @param {String[]} buttons
 */
function nextRound(buttons) {
	let data = {
		buttons: buttons
	};
	let dataJSON = JSON.stringify(data);

	wsSendData(dataJSON);

	if (state == 0) {
		state = 1;
		log("Sending POST request to panel 'round_start'");
		if (debugMode) {
			$.post("http://localhost:5454/game/round_start", {
				token: pointstoken
			});
		} else {
			$.post("http://" + location.hostname + ":6942/game/round_start", {
				token: pointstoken
			}); // production
		}
		log("Sent POST request");
	}
}

/**
 * Send user won points in array
 * Points = array with JSON data [{'user_id':id, 'points':points}]
 * @param {*} points 
 */
function sendPoints(points){
	log("Sending POST request to panel 'points apply'");
	if (debugMode) {
		$.post("http://localhost:5454/points/apply", {
			token: pointstoken,
			points: points
		});
	} else {
		$.post("http://" + location.hostname + ":6942/points/apply", {
			token: pointstoken,
			points: points
		}); // production
	}
	log("Sent POST request");
}

/**
 * Called by game
 * Set value of live header on user phone
 * If userNickname specified send to specific user, else send to everyone
 * @param {string} header 
 * @param {string} userNickname (optional)
 */
function setLiveHeader(header, userNickname) {
	let data;
	if (userNickname == null) {
		data = {
			header: header
		};
	} else {
		data = {
			userHeader: [userNickname, header]
		};
	}
	let dataJSON = JSON.stringify(data);

	wsSendData(dataJSON);
}

/**
 * Called by game
 * Clear live header
 * If userNickname specified send to specific user, else send to everyone
 * @param {String} userNickname 
 */
function clearLiveHeader(userNickname) {
	let data;
	if (userNickname == null) {
		data = {
			header: ""
		};
	} else {
		data = {
			userHeader: [userNickname, ""]
		};
	}
	let dataJSON = JSON.stringify(data);

	wsSendData(dataJSON);
}

/**
 * Called by game
 * Set value of live footer on user phone
 * If userNickname specified send to specific user, else send to everyone
 * @param {string} footer 
 * @param {string} userNickname (optional)
 */
function setLiveFooter(footer, userNickname) {
	let data;
	if (userNickname == null) {
		data = {
			footer: footer
		};
	} else {
		data = {
			userFooter: [userNickname, footer]
		};
	}
	let dataJSON = JSON.stringify(data);

	wsSendData(dataJSON);
}

/**
 * Called by game
 * Clear live footer
 * If userNickname specified send to specific user, else send to everyone
 * @param {String} userNickname 
 */
function clearLiveFooter(userNickname) {
	let data;
	if (userNickname == null) {
		data = {
			footer: ""
		};
	} else {
		data = {
			userFooter: [userNickname, ""]
		};
	}
	let dataJSON = JSON.stringify(data);

	wsSendData(dataJSON);
}

/**
 * The action a clients receives after pressing a button
 * @param {String} action wait or again
 */
function setAction(action) {
	let data = {
		action: action
	};
	let dataJSON = JSON.stringify(data);

	wsSendData(dataJSON);
}

/**
 * Called by websockets
 * Used to force stop game from admin panel
 */
function forceStop() {
	try {
		gameForceStop();
	} catch (error) {
		log("Gamerunner: received force stop, but no game is listening :(");
	}
}

/**
 * Called by game
 * Toggle information footer
 */
function toggleFooter() {
	if (footerEnabled) {
		footerEnabled = false;
		disableFooter();
		return false;
	} else {
		footerEnabled = true;
		enableFooter();
		return true;
	}
}

/**
 * Called by game
 * Stop game
 */
function stopGame() {
	let data = {
		stopGame: true
	};
	let dataJSON = JSON.stringify(data);

	wsSendData(dataJSON);

	state = 2;
	log("Sending POST request to panel 'stop_game'");
	if (debugMode) {
		$.post("http://localhost:5454/game/stop_game", {
			token: pointstoken
		});
	} else {
		$.post("http://" + location.hostname + ":6942/game/stop_game", {
			token: pointstoken
		}); // production
	}
	log("Sent POST request");
}

/**
 * Set status on status screen
 * @param {String} status
 * @param {String} userNickname (optional) show status to user
 */
function showStatus(status, userNickname) {
	let data;
	if (userNickname == null) {
		data = {
			status: status
		};
	} else {
		data = {
			userStatus: [userNickname, status]
		};
	}
	let dataJSON = JSON.stringify(data);

	wsSendData(dataJSON);
}

function switchScreen(screen) {
	let data = {
		switchScreen: screen
	};
	let dataJSON = JSON.stringify(data);

	wsSendData(dataJSON);
}

function loadGame(htmlFile) {
	log("Gamerunner: Loading html file '" + htmlFile + "'");

	loadInTransition();

	state = 0;

	setTimeout(() => {

		let $game = $("#gr-game");
		$game.empty();
		$game.load("games/" + htmlFile, function () {
			log("Gamerunner: Loaded html file");
		});
		loadOutTransition();
	}, 500);

}

function unloadGame() {
	loadInTransition();

	setTimeout(() => {
		let $game = $("#gr-game");
		$game.empty();

		loadOutTransition();
	}, 500);
}

var loadInTransition = function () {
	$transitionClose.src = '/transition-close.gif';
	$transitionOpen.style.visibility = 'hidden';
	$transitionClose.style.visibility = 'visible';
}

var loadOutTransition = function () {
	$transitionOpen.src = '/transition-open.gif';
	$transitionClose.style.visibility = 'hidden';
	$transitionOpen.style.visibility = 'visible';
}

var hideAllTransitions = function () {
	$transitionClose.style.visibility = 'hidden';
	$transitionOpen.style.visibility = 'hidden';
}

var enableFooter = function () {
	$("#gr-overlay-footer").show();
}

var disableFooter = function () {
	$("#gr-overlay-footer").hide();
}

var log = function (message) {
	if (logMessages) {
		console.log(message);
	}
}

$(document).ready(function () {
	if (debugMode) {
		log("DEBUG MODE -- DONT USE FOR PRODUCTION");
	}

	grinit();
	connect();

});