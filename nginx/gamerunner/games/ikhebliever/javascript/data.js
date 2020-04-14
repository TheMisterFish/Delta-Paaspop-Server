var data;
var alreadyDoneChoices = [];

function getRandomChoice(callback){
  var randomChoice;

    var random = Math.floor(Math.random() * data.length);
    randomChoice = data[random];
    alreadyDoneChoices.push(randomChoice);
    data.splice(random, 1);    

    return randomChoice;
}

function dataIsLoaded(){
  return data != undefined;
}


function loadJSONData() {
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', '/games/ikhebliever/questions.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            data = JSON.parse(xobj.responseText)
          }
          else{
            console.log(xobj.status)
          }
    };
    xobj.send(null);  
 }
