var data;
var alreadyDoneChoices = [];

function getRandomChoice(){
  var randomChoice;

    var random = Math.floor(Math.random() * data.length);
    randomChoice = data[random];

    if (alreadyDoneChoices.find(choice => choice == randomChoice)){
      //choice has already been done before

      getRandomChoice();
    }
    else{
      alreadyDoneChoices.push(randomChoice);
    }

    return randomChoice;
}

function dataIsLoaded(){
  return data != undefined;
}


function loadJSONData() {
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', '/games/would_you_rather/questions.json', true); // Replace 'my_data' with the path to your file
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
