const baseUrl = location.hostname + ":6942/games/paaspop/";
// Variables
var $transitionOpen,
	$transitionClose,
	$screenStarting,
	$screenQuestions,
	$screenEnding,
	userAnswers = [], // stores all the answers given by users  | Example: {user:"username",userId:"Id",data:"A"}
	userScore = [], // stores all the userIds and scores to be send to the API | Example: {user_Id:"id",points:80}
	allowedToRun;

// Initialize
quizInit();

// Toggle the footer of the gamerunner
disableFooter();


//////////////////////////////////////////////////////////////////////////////
/////                     START TEMPORARY DUMMY CODE                     /////
//////////////////////////////////////////////////////////////////////////////

// After 10 seconds, start the quiz
setTimeout(() => {

	// Start a quiz item 
	var quiz = 0; // Quiz: 0 
	var quizItemStart = 0; // Start at quiz item: 0
	var quizDuration = 10; // Duration: 10 seconds
	quizStart(quiz, quizItemStart, quizDuration);

}, 10000);

//////////////////////////////////////////////////////////////////////////////
/////                      END TEMPORARY DUMMY CODE                      /////
//////////////////////////////////////////////////////////////////////////////





// Quiz init
function quizInit() {

	// Define DOM elements
	$transitionOpen = document.getElementById('transition-open');
	$transitionClose = document.getElementById('transition-close');
	$screenStarting = document.getElementById('screen-starting');
	$screenQuestions = document.getElementById('screen-questions');
	$screenEnding = document.getElementById('screen-ending');

	// Define whether the quiz is allowed to run or not
	allowedToRun = true;

	// Switch the screen to the starting screen
	switchScreens(1);

}



// Quiz start
async function quizStart(quizNumber, quizQuestionNumber, quizDuration) {

	console.log('[QUIZ STARTED]');

	// Switch to the next question
	quizMainLoop(quizNumber, quizQuestionNumber, quizDuration);

}



// Quiz end
async function quizEnd() {

	console.log('[QUIZ ENDED]');

	// Don't allow the quiz to run anymore
	allowedToRun = false;

	// Trigger the close animation
	closeTransition();

	// Delay further actions for 1 second to make sure the close transition has completed
	await delay(1000);

	// Reset quiz item
	quizItemReset();

	// Switch the screen to the ending screen
	switchScreens(3);

	// Trigger the open animation
	openTransition();

	// Send the scored points to the clients
	sendPoints(userScore);

	// Send stop signal to clients and server
	stopGame();

}



// Quiz main loop
async function quizMainLoop(quizNumber, quizItemNumber, quizDuration) {

	// If the quiz is allowed to run
	if (allowedToRun) {

		// Load JSON data 
		var data = await loadData();

		// Quiz item
		var quizItem = data.quizzes[quizNumber].quizItems[quizItemNumber];

		// If there is a quiz item
		if (quizItem) {

			console.log('2) Starting next quiz question');

			// Start the next quiz item
			await quizItemNext(data, quizNumber, quizItemNumber, quizDuration);

			console.log('8) Ended quiz item');

			// Increase the quiz item number
			quizItemNumber++;

			// Start the next quiz item
			quizMainLoop(quizNumber, quizItemNumber, quizDuration);

		} else {

			// End the quiz
			quizEnd();

		}

	}

}



// Quiz question next
async function quizItemNext(data, quizNumber, quizItemNumber, quizDuration) {

	// Trigger the close animation
	closeTransition();

	// Delay further actions for 1 second to make sure the close transition has completed
	await delay(1000);

	// Switch the screen to the questions screen
	switchScreens(2);

	// Reset quiz item
	quizItemReset();

	// Apply data
	applyData(data, quizNumber, quizItemNumber);

	// Trigger the open animation
	openTransition();

	// Start the quiz question
	await quizItemActive(data, quizNumber, quizItemNumber, quizDuration)

}



// Close transition
function closeTransition() {

	console.log('3) Closing transition');

	$transitionOpen.style.visibility = 'hidden';
	$transitionClose.style.visibility = 'visible';
	$transitionClose.src = `${baseUrl}/images/transition-close.gif`;

}



// Open transition
function openTransition() {

	console.log('6) Opening transition');

	$transitionClose.style.visibility = 'hidden';
	$transitionOpen.style.visibility = 'visible';
	$transitionOpen.src = `${baseUrl}/images/transition-open.gif`;

}



// Delay function
function delay(t, v) {
	return new Promise(function (resolve) {
		setTimeout(resolve.bind(null, v), t)
	});
}



// Get quiz content 
async function loadData() {

	console.log('1) Loading JSON data');

	var response = await fetch(`${baseUrl}/data/quiz_data.json`);
	var json = await response.json();
	return json;

};



// Load the quiz into DOM
function applyData(data, quizNumber, quizItemNumber) {

	console.log('5) Applying data');

	// Data variables
	var quiz = data.quizzes[quizNumber];
	var quizItem = quiz.quizItems[quizItemNumber];

	// DOM elements
	var $artistText = document.getElementById('artist-text');
	var $questionText = document.getElementById('question-text');
	var $artistImage = document.getElementById('artist-image');
	var $answerA = document.getElementById('answer-a');
	var $answerB = document.getElementById('answer-b');
	var $answerC = document.getElementById('answer-c');

	// Send possible answers to clients
	nextRound(["A", "B", "C"]);

	// Send header to clients
	setLiveHeader(quizItem.question);

	// set client footer
	setLiveFooter(quiz.quizName);

	// Update DOM elements with values from data
	$artistText.innerHTML = quiz.quizName;
	$questionText.innerHTML = quizItem.question;
	$artistImage.style.backgroundImage = "url('" + quizItem.imagePath + "')";
	$answerA.innerHTML = "A) " + quizItem.answers[0];
	$answerB.innerHTML = "B) " + quizItem.answers[1];
	$answerC.innerHTML = "C) " + quizItem.answers[2];

}



// Quiz item is active
async function quizItemActive(data, quizNumber, quizItemNumber, seconds) {

	// Promise for asynchronous setInterval
	return await new Promise(resolve => {

		console.log('7) Started quiz item');

		// Time input
		seconds = seconds || 15; // 15 seconds by default

		// Update the timer DOM element
		var $timer = document.getElementById("timer");
		$timer.innerHTML = seconds;

		// Set an interval
		const interval = setInterval(() => {

			// Lower the countdown variable
			seconds--;

			// Display countdown
			if (seconds >= 0) {
				$timer.innerHTML = seconds;
			}

			// Exactly when the time is up
			if (seconds == 0) {

				// Display a the 'time is up' message
				document.getElementById("timer-message").style.display = "block";

			}
			// One second after the time is up
			else if (seconds == -1) {

				// Get the correct answer
				var correctQuizAnswer = data.quizzes[quizNumber].quizItems[quizItemNumber].correctAnswerIndex;

				// If the correct answer is A, display it
				if (correctQuizAnswer == 0) {
					document.getElementById("answer-a").style.backgroundColor = "#00ff80";
					sendAnswer("A");
				}
				// If the correct answer is B, display it
				else if (correctQuizAnswer == 1) {
					document.getElementById("answer-b").style.backgroundColor = "#00ff80";
					sendAnswer("B");
				}
				// If the correct answer is C, display it 
				else if (correctQuizAnswer == 2) {
					document.getElementById("answer-c").style.backgroundColor = "#00ff80";
					sendAnswer("C");
				}

				// Add the user the awarded points to the user score list.
				CalculateUserPointsForRound(correctQuizAnswer);
			}
			// Ten seconds after the time is up
			else if (seconds == -10) {

				// Clear the interval and resolve the promise
				clearInterval(interval);
				resolve();

			}

		}, 1000);

	});

}



// Quiz item reset
function quizItemReset() {

	console.log('4) Resetting quiz item');

	// DOM elements
	var $artistText = document.getElementById('artist-text');
	var $questionText = document.getElementById('question-text');
	var $artistImage = document.getElementById('artist-image');
	var $answerA = document.getElementById('answer-a');
	var $answerB = document.getElementById('answer-b');
	var $answerC = document.getElementById('answer-c');
	var $timer = document.getElementById('timer');
	var $timerMessage = document.getElementById('timer-message');

	// Update DOM elements with default placeholder values
	$artistText.innerHTML = "Placeholder";
	$questionText.innerHTML = "Placeholder";
	$artistImage.style.backgroundImage = `url(${baseUrl}'/images/placeholder.png')`;
	$answerA.innerHTML = "Placeholder";
	$answerB.innerHTML = "Placeholder";
	$answerC.innerHTML = "Placeholder";
	$answerA.style.backgroundColor = "#ffe600";
	$answerB.style.backgroundColor = "#ffe600";
	$answerC.style.backgroundColor = "#ffe600";
	$timer.innerHTML = "N";
	$timerMessage.style.display = "none";

}



// Switch to the provided screen
function switchScreens(screen) {

	// Switch
	if (screen == 1) {
		$screenStarting.style.visibility = 'visible';
		$screenQuestions.style.visibility = 'hidden';
		$screenEnding.style.visibility = 'hidden';
	} else if (screen == 2) {
		$screenStarting.style.visibility = 'hidden';
		$screenQuestions.style.visibility = 'visible';
		$screenEnding.style.visibility = 'hidden';
	} else if (screen == 3) {
		$screenStarting.style.visibility = 'hidden';
		$screenQuestions.style.visibility = 'hidden';
		$screenEnding.style.visibility = 'visible';
	}

}

//////////////////////////////////////////////////////////////////////////////
/////                     START  GAMERUNNER FUNCTIONS                    /////
//////////////////////////////////////////////////////////////////////////////

// Callable events

// Lets the game know when the game has been forced to stop (from i.e. the admin panel). Your game has 10 seconds to handle this event.
function gameForceStop() {
	allowedToRun = false;
	console.warn("[GAME FORCE STOPPED!]")
	quizEnd();
	stopGame();
}

// Information that has been sent from web sockets to the game runner, and that gets passed on to the game.
// data contains integer that correlates to the buttons of the game.
function gameUserInput(user, userId, data) {
	userAnswers.push({
		user: user,
		userId: userId,
		input: data
	});
	// userAnswers[0] = {user:"name",userId:"id",input:"A"}
}
//////////////////////////////////////////////////////////////////////////////
/////                      END GAMERUNNER FUNCTIONS                      /////
//////////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////////////////////
/////                     START  GAMERUNNER Helper FUNCTIONS             /////
//////////////////////////////////////////////////////////////////////////////

function CalculateUserPointsForRound(correctQuizAnswer) {
	var points,
		tempAnswer,
		currentPlayer,
		playerIndex;

	console.log(correctQuizAnswer);
	for (var i = 0; i < userAnswers.length; i++) {

		// Points that will be awarded to the players for answering that round
		points = 1;

		if (userAnswers[i].input == "A") {
			tempAnswer = 0;
		} else if (userAnswers[i].input == "B") {
			tempAnswer = 1;
		} else if (userAnswers[i].input == "C") {
			tempAnswer = 2;
		}

		if (tempAnswer == correctQuizAnswer) {
			// If the player has given the right answers he will be awarded an extra point.
			points = 2;
		}

		currentPlayer = userScore.find(score => score.user_id == userAnswers[i].userId);
		if (currentPlayer) {
			console.log(currentPlayer)
			// if a player is already in the scores list
			playerIndex = userScore.map(function (e) {
				return e.user_id;
			}).indexOf(userAnswers[i].userId);
			// playerIndex = userScore.indexOf(score => { score.user_id == userAnswers[i].userId; console.log(score); console.log(userAnswers[i]);} );

			console.log(playerIndex);
			console.log(userScore[playerIndex]);
			userScore[playerIndex].points += points;
		} else {
			userScore.push({
				user_id: userAnswers[i].userId,
				points: points
			});
			console.log(userScore);
		}
	}
	userAnswers = [];

}

//////////////////////////////////////////////////////////////////////////////
/////                      END GAMERUNNER Helper FUNCTIONS               /////
//////////////////////////////////////////////////////////////////////////////