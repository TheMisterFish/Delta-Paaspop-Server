// Variables

//All marbles to be generated
var colors = [
        "#d50000",
        "#C51162",
        "#AA00FF",
        "#6200EA",
        "#304FFE",
        "#2962FF",
        "#0091EA",
        "#FF00FF",
        "#00BFA5",
        "#00C853",
        "#64DD17",
        "#AEEA00",
        "#FFD600",
        "#FFAB00",
        "#FF6D00",
        "#DD2C00",
        "#78FFFF",
        "#F99AFF",
        "#FF8E8E",
        "#A0FF9A"
    ], // list of all the colors the marbles can have.
    marbles = [], // Object array containing the racing marbles | Example [{object:Matter.jsBody,players:[playerobject],position:number}].
    finishedMarbles = [], // Array of the finished marbles | Example [{Matter.jsbody}].
    updatePositionInterval, // Interval to check to current positions of the marbles during the race.
    forceStop = false,
    lobbyTime = 15000, // Waiting time for players to join the lobby.
    maxMarbles = 20, // Max amount of marbles the game will generate.
    playerAssignCounter = 0,
    players = [];

//Initialize game
gameInit();

// Toggle the footer of the gamerunner
disableFooter();


//////////////////////////////////////////////////////////////////////////////
/////                               START CODE                           /////
//////////////////////////////////////////////////////////////////////////////

setTimeout(() => {
    // switch to the gamescreen
    switchScreens(2);
    // Trigger the open animation
    loadOutTransition();
    // Start the actual game
    startGame();
}, lobbyTime);

//////////////////////////////////////////////////////////////////////////////
/////                      END START CODE                                /////
//////////////////////////////////////////////////////////////////////////////

async function gameInit() {

    //All screens
    $screenStarting = document.getElementById('screen-starting');
    $screenGame = document.getElementById('screen-game');
    $screenEnding = document.getElementById('screen-ending');


    // Switch the screen to the starting screen
    switchScreens(1);

}

// Starts the game
async function startGame() {

    // Start the Matter.js game engine
    startGameEngine();
    
    // Send all the marbles to the gamerunner so that the visitors can choose a marble
    startNextRound();

    // Delay further actions for 1 second to make sure the close transition has completed
    await delay(1000);

    // Wait for a few seconds to start
    await delay(3000);

    // Open the starting gates so that the marbles will begin the parcour.
    openMarbleGate();

    // Start checking the marbles y position to check their leaderboard position.
    updatePositionInterval = setInterval(updatePositionList, 50);
}

// Game ending
async function gameOver() {

    await delay(300);
    //Remove the position tracker interval
    clearInterval(updatePositionInterval);

    if (forceStop) {
        //Stop the game engine
        stopGameEngine();
    }

    await delay(3000);

    // Trigger the close animation
    loadInTransition();

    // Delay further actions for 1 second to make sure the close transition has completed
    await delay(1200);

    // Switch the screen to the ending screen
    switchScreens(3);

    // Trigger the open animation
    loadOutTransition();

    // Send the end score to the users
    postScore();

    // Let the API know the game is fully finished.
    stopGame();

    console.log("Game is over displaying scores:");
    for (var i = 0; i < marbles.length; i++) {
        console.log("position: " + (i + 1) + " is won by:" + finishedMarbles[i].label);
    }
}

// Add a marble to game with the playersname
async function generateMarble(player) {
    
    //  Generate marbles for each player so long the limit is not reached.
    if(marbles.length < maxMarbles)
    {
        circle = Bodies.circle(Math.floor((Math.random() * 10) + 1), -Height + 20, 20.0, {
            label: player.user,
            friction: 0.00001,
            restitution: 0.5,
            density: 0.001,
            render: {
                fillStyle: colors[marbles.length]
            }
        });
        addMarbleToLeaderboard(circle.label);
        marbles.push({object: circle, players:[player], position: marbles.length});
        World.add(world, circle);
        setLiveHeader("team:"+circle.label, player.user)
    }

    // Assing the other players to the existing marbles
    else{
        if(playerAssignCounter <= maxMarbles)
        {
            marbles[playerAssignCounter].players.push(player);
            playerAssignCounter++;
            setLiveHeader("team:"+marbles[playerAssignCounter].object.label, player.user)
        }
        else{
            playerAssignCounter = 0;
            marbles[playerAssignCounter].players.push(player)
            setLiveHeader("team:"+marbles[playerAssignCounter].object.label, player.user)
        }
    }
  
}

// Removes the gate object preventing the marbles from going on the track
function openMarbleGate() {
    World.remove(world, gate)
    if(marbles.length == 0)
    {
        gameOver();
    }
}

function marbleFinished(marble) {

    //If marble is is not yet finished
    if (!isMarbleInList(marble, finishedMarbles)) {
        // Add to finished marbles array
        finishedMarbles.push(marble);
    }

    //If the all marbles are finished
    if (finishedMarbles.length == marbles.length) {
        //Game is over
        gameOver();
    }

}

// Delay function
function delay(t, v) {
    return new Promise(function (resolve) {
        setTimeout(resolve.bind(null, v), t)
    });
}

// Resets the marble to starting position.
function resetMarbleToOrignalPosition(marble) {
    Matter.Body.setPosition(marble, { x: 0, y: -Height + 95 });
}

// Checks if the current object is already in the given collection returns a boolean.
function isMarbleInList(obj, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === obj.id) {
            return true;
        }
    }

    return false;
}

// Updates the current list of marble based on their Y positions.
function updatePositionList() {
    //Create an array to contain all active marbles that haven't finished
    var marblesStillRacing = [];

    for (var m = 0; m < marbles.length; m++) {

        //Check which marbles haven't finished yet
        if (!isMarbleInList(marbles[m].object, finishedMarbles)) {
            marblesStillRacing.push(marbles[m].object);
        }
    }

    //Sort the still racing marbles descending by their y position.
    marblesStillRacing.sort((a, b) => (b.position.y) - (a.position.y));

    //Get the children of the leaderboard-list
    var children = document.getElementById("leaderboard-list").children;
    for (var j = 0; j < marbles.length; j++) {
        if (j < finishedMarbles.length) {
            children[j].innerHTML = finishedMarbles[j].label;
            children[j].classList.remove("leaderboard-listItem");
            children[j].classList.add("leaderboard-listItemFinished")
        }
        else {
            children[j].innerHTML = marblesStillRacing[j - finishedMarbles.length].label
        }
    }
}

// Add marble to leaderboard list
function addMarbleToLeaderboard(name) {
    var li = document.createElement('li');
    li.id = marbles.length;
    li.classList.add("leaderboard-listItem");
    li.appendChild(document.createTextNode(name));
    var leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.appendChild(li);
}

// Switch to the provided screen
function switchScreens(screen) {

    // Switch
    if (screen == 1) {
        $screenStarting.style.visibility = 'visible';
        $screenGame.style.visibility = 'hidden';
        $screenEnding.style.visibility = 'hidden';
    }
    else if (screen == 2) {
        $screenStarting.style.visibility = 'hidden';
        $screenGame.style.visibility = 'visible';
        $screenEnding.style.visibility = 'hidden';
    }
    else if (screen == 3) {
        $screenStarting.style.visibility = 'hidden';
        $screenGame.style.visibility = 'hidden';
        $screenEnding.style.visibility = 'visible';
    }

}

// Creates the endscoreboard on the closing page.
function displayScore() {
    for (var i = 0; i < finishedMarbles.length; i++) {
        var li = document.createElement('li');
        li.id = i;
        li.classList.add("leaderboard-listItem");
        li.appendChild(document.createTextNode(finishedMarbles[i].label));
        var scoreList = document.getElementById("score");
        scoreList.appendChild(li);
    }
}

// Sends the score of the users to the API
function postScore()
{
    var userId = "",
        score = 1,
        userScores = [],
        tempObject;

    for(var i = 0; i < finishedMarbles.length; i++)
    {
        score = (finishedMarbles.length - i);
        tempObject = marbles.find( marble => marble.object.label == finishedMarbles[i].label);
        if("players" in tempObject)
        {
            console.log(tempObject.players.length);
            for(var j = 0; j < tempObject.players.length ; j++)
            {
                userId = tempObject.players[j].userId;
                userScores.push({'user_id':userId, 'points':score});

            }
        }
       
    }
    console.log(userScores);
    sendPoints(userScores);
}

//////////////////////////////////////////////////////////////////////////////
/////                     START  GAMERUNNER FUNCTIONS                    /////
//////////////////////////////////////////////////////////////////////////////

function startNextRound() {
    nextRound(["Racen!"]);
}

// Callable events

// Lets the game know when the game has been forced to stop (from i.e. the admin panel). Your game has 10 seconds to handle this event.
function gameForceStop() {
    gameOver();
}

// Information that has been sent from web sockets to the game runner, and that gets passed on to the game.
// data contains integer that correlates to the buttons of the game.
function gameUserInput(user, userId, data) {
    console.log("player: "+user+" joined the race!")
    var player = {user:user,userId: userId};
    players.push({'user_id':userId, 'points':1});
    generateMarble(player);
}
//////////////////////////////////////////////////////////////////////////////
/////                      END GAMERUNNER FUNCTIONS                      /////
//////////////////////////////////////////////////////////////////////////////