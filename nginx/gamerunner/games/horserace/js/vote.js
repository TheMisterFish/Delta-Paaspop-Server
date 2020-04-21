var players = [];
var points = [];

var vote1 = 0;
var vote2 = 0;
var vote3 = 0;
var vote4 = 0;

var elem1 = document.getElementById('vote1');
var elem2 = document.getElementById('vote2');
var elem3 = document.getElementById('vote3');
var elem4 = document.getElementById('vote4');

elem1.innerHTML = vote1;
elem2.innerHTML = vote2;
elem3.innerHTML = vote3;
elem4.innerHTML = vote4;

function gameUserInput(user, userId, data) {
  console.log("kaas1")
  if (voteTime == "TRUE") {
    players.push([user, userId, data]);
    lastItem = players.length - 1;

    vote = players[lastItem][2];

    switch (vote) {
      case "BUS #1":
        vote1++;
        elem1.innerHTML = vote1;
        break;
      case "BUS #2":
        vote2++;
        elem2.innerHTML = vote2;
        break;
      case "BUS #3":
        vote3++;
        elem3.innerHTML = vote3;
        break;
      case "BUS #4":
        vote4++;
        elem4.innerHTML = vote4;
        break;
      default:
        break;
    }

  } if (voteTime == "FALSE") {
    console.log("Iemand is te laat " + user)
  }

}

function sendPoint(Placing) {
  let answer;
  players.forEach(function (player) {
    switch (player[2]) {
      case "BUS #1":
        answer = 1
        break;
      case "BUS #2":
        answer = 2
        break;
      case "BUS #3":
        answer = 3
        break;
      case "BUS #4":
        answer = 4
        break;
      default:
        break;
    }

    console.log(Placing[0], answer, Placing[0] == answer);
    if (Placing[0] == answer) { points.push({ "user_id": player[1], "points": 4 }) }
    if (Placing[1] == answer) { points.push({ "user_id": player[1], "points": 3 }) }
    if (Placing[2] == answer) { points.push({ "user_id": player[1], "points": 2 }) }
    if (Placing[3] == answer) { points.push({ "user_id": player[1], "points": 1 }) }
  });

  console.log(points)
  sendPoints(points)

}

// TEST STRING
//  gameUserInput("tester", "BUS #1"), gameUserInput("tester1", "BUS #1"), gameUserInput("tester2", "BUS #1"), gameUserInput("tester3", "BUS #1"), gameUserInput("tester4", "BUS #1"), gameUserInput("tester5", "BUS #1"), gameUserInput("tester6", "BUS #1"),gameUserInput("tester7", "BUS #2"), gameUserInput("tester8", "BUS #2"), gameUserInput("tester9", "BUS #2"), gameUserInput("tester10", "BUS #4"), gameUserInput("tester11", "BUS #4"), gameUserInput("tester12", "BUS #4"), gameUserInput("tester13", "BUS #3"), gameUserInput("tester14", "BUS #4"), gameUserInput("tester15", "BUS #4"), gameUserInput("tester16", "BUS #3"), gameUserInput("tester17", "BUS #2"), gameUserInput("tester18", "BUS #4") 

// TEST STRING NEW
// gameUserInput("tester", 0, "BUS #1"), gameUserInput("tester1", 1, "BUS #1"), gameUserInput("tester2", 2, "BUS #1"), gameUserInput("tester3", 3,  "BUS #1"), gameUserInput("tester4", 4,  "BUS #1"), gameUserInput("tester5", 5,  "BUS #1"), gameUserInput("tester6", 6,  "BUS #1"),gameUserInput("tester7", 7,  "BUS #2"), gameUserInput("tester8", 8,  "BUS #2"), gameUserInput("tester9", 9,  "BUS #2"), gameUserInput("tester10", 10,  "BUS #4"), gameUserInput("tester11", 11,  "BUS #4"), gameUserInput("tester12", 12,  "BUS #4"), gameUserInput("tester13", 13,  "BUS #3"), gameUserInput("tester14", 14,  "BUS #4"), gameUserInput("tester15", 15,  "BUS #4"), gameUserInput("tester16", 16,  "BUS #3"), gameUserInput("tester17", 17,  "BUS #2"), gameUserInput("tester18", 18,  "BUS #4") 
// gameUserInput("tester", '0', "BUS #1"), gameUserInput("tester1", '1', "BUS #1"), gameUserInput("tester2", '2', "BUS #1"), gameUserInput("tester3", '3',  "BUS #1"), gameUserInput("tester4", '4',  "BUS #1"), gameUserInput("tester5", '5',  "BUS #1"), gameUserInput("tester6", '6',  "BUS #1"),gameUserInput("tester7", '7',  "BUS #2"), gameUserInput("tester8", '8',  "BUS #2"), gameUserInput("tester9", '9',  "BUS #2"), gameUserInput("tester10", '10',  "BUS #4"), gameUserInput("tester11", '11',  "BUS #4"), gameUserInput("tester12", '12',  "BUS #4"), gameUserInput("tester13", '13',  "BUS #3"), gameUserInput("tester14", '14',  "BUS #4"), gameUserInput("tester15", '15',  "BUS #4"), gameUserInput("tester16", '16',  "BUS #3"), gameUserInput("tester17", '17',  "BUS #2"), gameUserInput("tester18", '18',  "BUS #4") 
