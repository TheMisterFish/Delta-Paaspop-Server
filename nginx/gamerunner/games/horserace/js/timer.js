var timeLeft = 40;
var elem = document.getElementById('timer');

var timerId = setInterval(countdown, 1000);
var voteTime = "TRUE";

function countdown() {

  if (timeLeft == -1) {
    clearTimeout(timerId);
    document.getElementById('timer').style.display = "none";
    voteTime = "FALSE";
    race();

  } else {
    elem.innerHTML = timeLeft;
    timeLeft--;
  }
}

if (gameUserJoined(user, userId)) {
  sendUserButtons(["BUS #1", "BUS #2", "BUS #3", "BUS #4"], user)
  console.log(userId)
  console.log(user)
}

