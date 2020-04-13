var timeLeft = 30;
var elem = document.getElementById('timer');

var timerId = setInterval(countdown, 1000);
var voteTime = "TRUE";

if (gameUserJoined(user, userId)) {
  sendUserButtons(["BUS #1", "BUS #2", "BUS #3", "BUS #4"], user)
}

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

// setTimeout(() => {
//   //voor scherm
//   nextRound(["BUS #1", "BUS #2", "BUS #3", "BUS #4"])
//   setTimeout(() => {
//     countdown()
//   }, 10000);
// }, 10000);