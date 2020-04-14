//---------------------------------CONSTRUCTORS----------------------------------------------------------------------------------------------

class Bus {

    constructor(busId, name, speed, color, votes) {
        this.busId = busId;
        this.name = name;
        this.speed = speed;
        this.color = color;
        this.votes = votes;
    }
}

class Medal {

    constructor(medalId, name) {
        this.medalId = medalId;
        this.name = name
    }
}

//---------------------------------BUILD----------------------------------------------------------------------------------------------

const busses = {
    b1: new Bus(1, "redBus", 5, "red", 238, 8, 0),
    b2: new Bus(2, "yellowBus", 4, "yellow", 238, 251, 0),
    b3: new Bus(3, "blueBus", 4, "blue", 238, 494, 0),
    b4: new Bus(4, "greenBus", 2, "Green", 238, 737, 0)
};

const medals = {
    m1: new Medal(5, "redMedal"),
    m2: new Medal(6, "yellowMedal"),
    m3: new Medal(7, "blueMedal"),
    m4: new Medal(8, "greenMedal")
};
// spawn Busses
busW = window.innerWidth / 100 * 12.65625;
busH = window.innerHeight / 100 * 8.185975609756097;

var bus = new Image(busW, busH);
bus.src = '/games/horserace/img/download.gif';
bus.id = busses.b1.busId;
bus.name = busses.b1.name;
document.getElementById('plane').appendChild(bus);


var bus2 = new Image(busW, busH);
bus2.src = '/games/horserace/img/download.gif';
bus2.id = busses.b2.busId;
bus2.name = busses.b2.name;
document.getElementById('plane').appendChild(bus2);


var bus3 = new Image(busW, busH);
bus3.src = '/games/horserace/img/download.gif';
bus3.id = busses.b3.busId;
bus3.name = busses.b3.name;
document.getElementById('plane').appendChild(bus3);


var bus4 = new Image(busW, busH);
bus4.src = '/games/horserace/img/download.gif';
bus4.id = busses.b4.busId;
bus4.name = busses.b4.name;
document.getElementById('plane').appendChild(bus4);

// spawn Medals
medalW = window.innerWidth / 100 * 4.661458333333333;
medalH = window.innerHeight / 100 * 8.185975609756097;

var medal = new Image(medalW, medalH);
medal.src = '/games/horserace/img/loser.png';
medal.id = medals.m1.medalId;
medal.name = medals.m1.name;
document.getElementById('medals').appendChild(medal);

var medal2 = new Image(medalW, medalH);
medal2.src = '/games/horserace/img/loser.png';
medal2.id = medals.m2.medalId;
medal2.name = medals.m2.name;
document.getElementById('medals').appendChild(medal2);

var medal3 = new Image(medalW, medalH);
medal3.src = '/games/horserace/img/loser.png';
medal3.id = medals.m3.medalId;
medal3.name = medals.m3.name;
document.getElementById('medals').appendChild(medal3);

var medal4 = new Image(medalW, medalH);
medal4.src = '/games/horserace/img/loser.png';
medal4.id = medals.m4.medalId;
medal4.name = medals.m4.name;
document.getElementById('medals').appendChild(medal4);


//---------------------------------LOGIC---------------------------------------------------------------------------------------------- 

function resetPos() {
    document.getElementById('1').style.position = "relative";
    document.getElementById('1').style.left = "1px";
    document.getElementById('2').style.position = "relative";
    document.getElementById('2').style.left = "1px";
    document.getElementById('3').style.position = "relative";
    document.getElementById('3').style.left = "1px";
    document.getElementById('4').style.position = "relative";
    document.getElementById('4').style.left = "1px";
}

function randomSpeed() {
    setInterval(
        function () {
            var randomSpeedMultiplier = Math.floor((Math.random() * 5) + 1);
            return randomSpeedMultiplier;
        }, 3000);
}

var total = 0;
var Placing = [];

function move(bus_id) {
    return new Promise(resolve => {
        setTimeout(() => {

            let originalPos = parseInt(document.getElementById(bus_id).style.left, 10);
            var randomSpeedMultiplier = Math.floor((Math.random() * 20) + 1);
            var step = 1 * randomSpeedMultiplier;
            let newPos = originalPos + step;
            document.getElementById(bus_id).style.left = newPos.toString() + "px";
            resolve(newPos);
        }, 100);
    });
}

async function start_moving(bus_id) {
    let bus = await move(bus_id);
    const distance = window.innerWidth / 100 * 82;

    if (bus > distance) {
        // console.log("🏁🚌  " + bus_id + "  finished");
        Placing.push(bus_id)
        return Placing;

    } else {
        start_moving(bus_id)
    }
}

function CallWinners() {

    if (Placing[0] == 1) {
        console.log("🚌'#1' 🏆");
    }

    if (Placing[0] == 2) {
        console.log("🚌'#2' 🏆");
    }

    if (Placing[0] == 3) {
        console.log("🚌'#3' 🏆");
    }

    if (Placing[0] == 4) {
        console.log("🚌'#4' 🏆");
    }

    SpawnTrophies()
}

function SpawnTrophies() {

    var display = false;

    if (Placing[0] == 1) { medal.src = '../games/horserace/img/gold.png'; } if (Placing[1] == 1) { medal.src = '../games/horserace/img/silver.png'; } if (Placing[2] == 1) { medal.src = '../games/horserace/img/bronze.png'; } if (Placing[3] == 1) { medal.src = '../games/horserace/img/loser.png'; }
    if (Placing[0] == 2) { medal2.src = '../games/horserace/img/gold.png'; } if (Placing[1] == 2) { medal2.src = '../games/horserace/img/silver.png'; } if (Placing[2] == 2) { medal2.src = '../games/horserace/img/bronze.png'; } if (Placing[3] == 2) { medal2.src = '../games/horserace/img/loser.png'; }
    if (Placing[0] == 3) { medal3.src = '../games/horserace/img/gold.png'; } if (Placing[1] == 3) { medal3.src = '../games/horserace/img/silver.png'; } if (Placing[2] == 3) { medal3.src = '../games/horserace/img/bronze.png'; } if (Placing[3] == 3) { medal3.src = '../games/horserace/img/loser.png'; }
    if (Placing[0] == 4) { medal4.src = '../games/horserace/img/gold.png'; } if (Placing[1] == 4) { medal4.src = '../games/horserace/img/silver.png'; } if (Placing[2] == 4) { medal4.src = '../games/horserace/img/bronze.png'; } if (Placing[3] == 4) { medal4.src = '../games/horserace/img/loser.png'; }

    if (display = true) {
        document.getElementById('medals').style.display = "block";
    }

    display = true;

    if (Placing[0] == 1) { sendAnswer("BUS #1") };
    if (Placing[0] == 2) { sendAnswer("BUS #2") };
    if (Placing[0] == 3) { sendAnswer("BUS #3") };
    if (Placing[0] == 4) { sendAnswer("BUS #4") };

}

function pixelsToPercent(w, h) {
    var screenW = window.innerWidth;
    var screenH = window.innerHeight;

    proW = w / screenW * 100;
    proH = h / screenH * 100;

    console.log("w " + proW);
    console.log("h " + proH);
}


//---------------------------------RACE-----------------------------------------------------------------------------------------------------------------------------------------

// race function
setTimeout(() => {
    nextRound(["BUS #1", "BUS #2", "BUS #3", "BUS #4"])
}, 10000);

function race() {

    // Reset position
    resetPos() // resets the position of all objects
    // Move A to B \ Game Start + random
    // console.log("🏁Start")
    start_moving(1)
    start_moving(2)
    start_moving(3)
    start_moving(4)

    // Game Ends
    setTimeout(() => {
        CallWinners()
        // console.log("🏁Stop Race")
        sendPoint(Placing)
        switchScreen("exit")
    }, 18000);

    setTimeout(() => {
        stopGame()
    }, 20000);

    Placing = [];

}
