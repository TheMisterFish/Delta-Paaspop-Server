var timeLeft = 30;
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

countdown()
