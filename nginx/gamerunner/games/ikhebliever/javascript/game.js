var _question,
  _timeBetweenRounds,
  _updateSpeedInSec,
  _timeLeft,
  _paused = false,
  _timerUpdateSpeed = 1000,
  _gameLoop,
  _startingNewRound = false,
  _maxAmountOfRounds = 5,
  _amountOfRoundsDone = 0,
  _userJoinTime = 10000,
  _userVotingData = [],
  _endScreenTime = 10000,
  _gameStarted = false;

//Game controls
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function runGame(timeBetweenRounds, debug = false) {
  _timeBetweenRounds = timeBetweenRounds;
  _updateSpeedInSec = 100;
  _timeLeft = timeBetweenRounds;
  loadJSONData();

  if (debug) {
    initDebug();
  }

  updateVisualTimer(_timeBetweenRounds);
  setTimeout(() => {
    startGame();
  }, _userJoinTime);
}

function startGame() {
  if (_gameLoop == null) {
    _gameStarted = true;
    startRound();

    //Wait for the transition to load
    setTimeout(() => {
      toggleStartPage();
      toggleMainGamePage();
    }, 500);

    //Start the game loop
    _gameLoop = setInterval(() => {
      if (!_paused) {
        updateGame();
      }
    }, _timerUpdateSpeed);
  }
}

function stopGameLocal() {
  clearInterval(_gameLoop);
  _gameLoop = null;

  loadInTransition();

  toggleMainGamePage();
  toggleEndPage();

  loadOutTransition();
  showMobileEndScreen();
  var userPoints = _userVotingData.map(({ user_id, points }) => ({user_id, points}));

  console.log("points are: " + JSON.stringify(userPoints));
  sendPoints(userPoints);

  setTimeout(() => {
    stopGame();
  }, _endScreenTime);
}

function gameForceStop() {
  stopGameLocal();
}

function startRound() {
  loadInTransition();

  //Update amount of rounds done
  _amountOfRoundsDone += 1;

  //Reset all round controls
  _question = getRandomChoice();

  _timeLeft = _timeBetweenRounds + 1;
  setLiveHeader("ronde " + _amountOfRoundsDone + " van " + _maxAmountOfRounds);

  //Wait for the transition to load
  setTimeout(() => {
    updateChoices();
    updateBackgroundImageSizes(50 + "%").then(() => {
      loadOutTransition();
      updateVisualTimer(_timeBetweenRounds);
      nextRound(_question.ButtonText);
      _startingNewRound = false;
    });
  }, 500);
}

function updateGame() {
  //If time is left update the timer and detract one second
  if (_timeLeft > 0 && !_startingNewRound) {
    _timeLeft -= 1;
    updateVisualTimer(_timeLeft);
  }
  //If game has gone through all rounds stop the game
  else if (_amountOfRoundsDone >= _maxAmountOfRounds) {
    stopGameLocal();
  }
  //Round is done, start new round
  else if (!_startingNewRound) {
    _startingNewRound = true;
    startRound();
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Visual updating
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateChoices() {
  var questions = _question.answers;

  document.getElementById("choice_left_text").innerHTML = questions[0];
  document.getElementById("choice_right_text").innerHTML = questions[1];

  resetVotes();
}

function resetVotes() {
  var voteNode, VotePercentNode;
  for (var i = 0; i < Object.keys(_question.answers).length; i++) {
    voteNode = document.getElementsByClassName("vote" + i)[0];
    VotePercentNode = document.getElementsByClassName("votePercent" + i)[0];

    voteNode.innerHTML = "0 keer";
    VotePercentNode.innerHTML = _question.ButtonText[i] + " = 0%";
  }
}

function gameUserInput(user, userid, data) {
  if (_gameStarted && !_startingNewRound && !_paused) {
    var index = _question.ButtonText.indexOf(data);

    updateVotes(index);
    saveUserVote(userid, index, user);
  }
}

function saveUserVote(userId, index, userName) {
  var currentUserVotingData = _userVotingData.find((usr) => usr.user_id == userId);

  if (currentUserVotingData) {
      currentUserVotingData.points += 1;
      currentUserVotingData.chosenAnswersWithRound.push({answerIndex: index, roundIndex: _amountOfRoundsDone -1});
  } else {
    _userVotingData.push({ user_id: userId, points: 1, username: userName, chosenAnswersWithRound: [{ answerIndex: index, roundIndex: _amountOfRoundsDone - 1}] });
  }
}

function updateVotes(choiceIndex) {
  //First update the amount of votes
  addVote(choiceIndex);

  var totalVotes = getTotalAmountOfVotes();

  //Update the visual percentages of each size
  updateVotePercentages(totalVotes);

  //Update the background images based
  updateBackgroundImageSizes(
    (document
      .getElementsByClassName("vote0")[0]
      .innerHTML.replace(" keer", "") /
      totalVotes) *
      100 +
      "%"
  );
}

function addVote(voteIndex) {
  var voteNode = document.getElementsByClassName("vote" + voteIndex)[0];
  var currentAmountOfVotes = voteNode.innerHTML.replace(" keer", "");

  voteNode.innerHTML = Number(currentAmountOfVotes) + 1 + " keer";
}

function getTotalAmountOfVotes() {
  var totalVotes = 0;
  for (var i = 0; i < Object.keys(_question.answers).length; i++) {
    totalVotes += Number(
      document
        .getElementsByClassName("vote" + i)[0]
        .innerHTML.replace(" keer", "")
    );
  }
  return totalVotes;
}

function updateVotePercentages(totalVotes) {
  var visualVoteNode, visualVotePercentNode, updatePercentage, btnText;
  for (var i = 0; i < Object.keys(_question.answers).length; i++) {
    //Get both voteNode and VotePercentNode from DOM
    visualVoteNode = document.getElementsByClassName("vote" + i)[0];
    visualVotePercentNode = document.getElementsByClassName(
      "votePercent" + i
    )[0];

    //Calculate the new percentage
    updatePercentage =
      (visualVoteNode.innerHTML.replace(" keer", "") / totalVotes) * 100;

    btnText = _question.ButtonText[i] + " = ";

    //Update the Percentage and round that percentage dependant on if the index is even or not so we get correct percentages
    visualVotePercentNode.innerHTML =
      btnText + Math.round(updatePercentage) + "%";
  }
}

function updateBackgroundImageSizes(amountInPercent) {
  var image2 = document.getElementById("background_area_A");
  return $(image2)
    .finish()
    .animate(
      {
        width: amountInPercent,
      },
      200
    )
    .promise();
}

function updateVisualTimer(value) {
  document.getElementById("timer").innerHTML = value;
}

function showMobileEndScreen() {
  // Switch the clients screen to exit
  switchScreen("exit"); 
  var endingText = "";
  var random = 0;
  var maxChoicesMadeShown = 3;

  _userVotingData.forEach((user) => {
    maxChoicesMadeShown = (user.chosenAnswersWithRound.length >= maxChoicesMadeShown) ? maxChoicesMadeShown : user.chosenAnswersWithRound.length;
    endingText = "";
    for(var i = 0; i < maxChoicesMadeShown; i++){
      random = user.chosenAnswersWithRound[i];
      endingText += "<br>" + Number(i + 1) + ". " + alreadyDoneChoices[random.roundIndex].answers[random.answerIndex];
    }
    showStatus("<span style='color: #FFE600'>Bedankt voor het spelen!<br><br></span> <span>Sommige keuzes die jij gemaakt hebt zijn:</span> " + "<span style='color: #FFE600'>" + endingText + "<span>", user.username); 
  })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//DOM manipulation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function toggleStartPage() {
  console.log("toggling");
  $("#opening-page").toggle();
}

function toggleEndPage() {
  console.log("toggling");
  $("#closing-page").toggle();
}

function toggleMainGamePage() {
  console.log("toggling");
  $("#content").toggle();
}

//Calculate functions
function isEven(n) {
  return n % 2 == 0;
}

//Debug
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function initDebug() {
  console.log("debug mode loaded");
  $(document).keypress(function (e) {
    if (e.which == 44) {
      gameUserInput("test1", 0);
    } else if (e.which == 46) {
      gameUserInput("test2", 1);
    }
  });
}
