const socketurl = "ws://localhost:9000";
const debug = true;

var socket;
var footerEnabled = false;

var $transitionOpen, $transitionClose;

var grinit = function(){
    $transitionOpen     =   document.getElementById('gr-transition-open');
    $transitionClose    =   document.getElementById('gr-transition-close');
}

function establishNewConnection(){
    closeConnection();

    log("Websocket: opening connection to '" + socketurl + "'....");

    this.socket = new WebSocket(socketurl);

    registerEventListeners(this.socket);
}

var registerEventListeners = function(socket){
    socket.addEventListener('error', function(event){
        wsError(event.data);
    });

    socket.addEventListener('close', function(event){
        wsClose();
    });

    socket.addEventListener('open', function (event) {
        wsOpen();
    });

    socket.addEventListener('message', function (event) {
        wsMessage(event);
    });
}

var wsMessage = function(event){
    let message = event.data;
    log("Websocket: '" + message + "'");
}

var wsOpen = function(){
    log('Websocket: connection opened');
}

var wsClose = function(){
    log('Websocket: connection closed');
}

var wsError = function(error){
    log('Websocket: websocket error! ' + error);
}

/**
 * Send data to websockets
 * Returns true if message successfully sent
 * @param {string} data 
 */
var wsSendData = function(data){
    let sent = false;
    try{
        socket.send(data);
        sent = true;
        log("Websocket: sent message '" + data + "'");
    }catch(error){
        log("Websocket: failed to send message '" + data + "' due to the following error: " + error);
    }
    return sent;
}

var closeConnection = function(){
    if(this.socket != null){
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
var startGame = function(name){
    loadGame(name + ".html");
}

/**
 * Called by websockets
 * Sends user input to game
 */
var userInput = function(user, data){
    try {
        gameUserInput(user, data);
    } catch (error) {
        log("Gamerunner: unexpected data '" + data + "' from user '" + user.name + "'");
    }
}

/**
 * Called by game
 * Sends outcome to users ie correct answer
 */
function userResults(result){
    let data = {data: "result", result: result};
    let dataJSON = JSON.stringify(data);

    wsSendData(dataJSON);
}

/**
 * Called by game
 * Lets clients know next round has started, and show buttons given
 * @param {int} round 
 * @param {string[]} buttons 
 */
function nextRound(round, buttons){
    let data = {data: "nextround", round: round, buttons: buttons};
    let dataJSON = JSON.stringify(data);

    wsSendData(dataJSON);
}

/**
 * Called by game
 * Set value of live header on user phone
 * If userId specified send to specific user, else send to everyone
 * @param {string} header 
 * @param {string} userId (optional)
 */
function setLiveHeader(header, userId){
    let data;
    if(userId == null){
        data = {data: "setliveheader", header: header};
    }else{
        data = {data: "setliveheader", header: header, userId: userId};
    }
    let dataJSON = JSON.stringify(data);

    wsSendData(dataJSON);
}

/**
 * Called by game
 * Clear live header
 * If userId specified send to specific user, else send to everyone
 * @param {string} userId 
 */
function clearLiveHeader(userId){
    let data;
    if(userId == null){
        data = {data: "clearliveheader"};
    }else{
        data = {data: "clearliveheader", userId: userId};
    }
    let dataJSON = JSON.stringify(data);

    wsSendData(dataJSON);
}

/**
 * Called by websockets
 * Used to force stop game from admin panel
 */
function forceStop(){
    try{
        gameForceStop();
    }catch(error){
        log("Gamerunner: received force stop, but no game is listening");
    }
}

/**
 * Called by game
 * Toggle information footer
 */
function toggleFooter(){
    if(footerEnabled){
        disableFooter();
        return false;
    }else{
        enableFooter();
        return true;
    }
}

/**
 * Called by game
 * Stop game
 */
function stopGame(){
    let data = {data: "stopgame"};
    let dataJSON = JSON.stringify(data);

    wsSendData(dataJSON);
}

function loadGame(htmlFile){
    log("Gamerunner: Loading html file '" + htmlFile + "'");

    loadInTransition();

    setTimeout(() => {

        let $game = $("#gr-game");
        $game.empty();
        $game.load(htmlFile, function(){
            log("Gamerunner: Loaded html file");
        });
        loadOutTransition();

        setTimeout(() => {
            hideAllTransitions();
        }, 1000);

    }, 500);

}

var loadInTransition = function(){
    $transitionOpen.style.visibility='hidden';
    $transitionClose.style.visibility='visible';
    $transitionClose.src='/transition-close.gif';
}

var loadOutTransition = function(){
    $transitionClose.style.visibility='hidden';
    $transitionOpen.style.visibility='visible';
    $transitionOpen.src='/transition-open.gif';
}

var hideAllTransitions = function(){
    $transitionClose.style.visibility='hidden';
    $transitionOpen.style.visibility='hidden';
}

var enableFooter = function(){
    $("#gr-overlay-footer").show();
}

var disableFooter = function(){
    $("#gr-overlay-footer").hide();
}

var log = function(message){
    if(debug){
        console.log(message);
    }
}

$(document).ready(function(){
    grinit();
});