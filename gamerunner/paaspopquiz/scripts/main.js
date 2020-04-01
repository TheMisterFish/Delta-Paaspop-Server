// Variables
var $transitionOpen, 
    $transitionClose, 

    $screenStarting, 
    $screenQuestions,
    $screenEnding,

    allowedToRun;
    

// Start the following quiz 
var quiz            =   1;      // Quiz: 0 
var quizStartItem   =   0;      // Start at quiz item: 0
var quizDuration    =   10;     // Duration: 10 seconds


// Initialize
quizInit();





//////////////////////////////////////////////////////////////////////////////
/////                     START TEMPORARY DUMMY CODE                     /////
//////////////////////////////////////////////////////////////////////////////

// After 10 seconds, start the quiz
setTimeout(()=>{

    quizStart(quiz, quizStartItem, quizDuration);

}, 10000);

//////////////////////////////////////////////////////////////////////////////
/////                      END TEMPORARY DUMMY CODE                      /////
//////////////////////////////////////////////////////////////////////////////





// Quiz init
async function quizInit(){

    // Define DOM elements
    $transitionOpen     =   document.getElementById('transition-open');
    $transitionClose    =   document.getElementById('transition-close');
    $screenStarting     =   document.getElementById('screen-starting');
    $screenQuestions    =   document.getElementById('screen-questions');
    $screenEnding       =   document.getElementById('screen-ending');

    // Define whether the quiz is allowed to run or not
    allowedToRun = true;




    // Switch the screen to the starting screen
    switchScreens(1);

}



// Quiz start
async function quizStart(quizNumber, quizQuestionNumber, quizDuration){

    console.log('[QUIZ STARTED]');

    // Switch to the next question
    quizMainLoop(quizNumber, quizQuestionNumber, quizDuration);

}



// Quiz end
async function quizEnd(){

    console.log('[QUIZ ENDED]');

    // Don't allow the quiz to run anymore
    allowedToRun = false;

    // Trigger the close animation
    closeTransition();

    // Delay further actions for 1 second to make sure the close transition has completed
    await delay(1000);

    // Reset quiz item
    quizItemReset();

    // Switch the screen to the ending screen
    switchScreens(3);

    // Trigger the open animation
    openTransition();

}



// Quiz main loop
async function quizMainLoop(quizNumber, quizItemNumber, quizDuration){

    // If the quiz is allowed to run
    if(allowedToRun){
   
        // Load JSON data 
        var data = await loadData();
        
        // Quiz item
        var quizItem = data.quizzes[quizNumber].quizItems[quizItemNumber];

        // If there is a quiz item
        if(quizItem){

            console.log('2) Starting next quiz question');

            // Start the next quiz item
            await quizItemNext(data, quizNumber, quizItemNumber, quizDuration);

            console.log('8) Ended quiz item');

            // Increase the quiz item number
            quizItemNumber++;

            // Start the next quiz item
            quizMainLoop(quizNumber, quizItemNumber, quizDuration);

        }
        else{
            
            // End the quiz
            quizEnd();

        }
        
    }
    
}



// Quiz question next
async function quizItemNext(data, quizNumber, quizItemNumber, quizDuration){

    // Trigger the close animation
    closeTransition();

    // Delay further actions for 1 second to make sure the close transition has completed
    await delay(1000);

    // Switch the screen to the questions screen
    switchScreens(2);

    // Reset quiz item
    quizItemReset();

    // Apply data
    applyData(data, quizNumber, quizItemNumber);

    // Trigger the open animation
    openTransition();

    // Start the quiz question
    await quizItemActive(data, quizNumber, quizItemNumber, quizDuration)

}



// Close transition
function closeTransition(){

    console.log('3) Closing transition');

    $transitionOpen.style.visibility='hidden';
    $transitionClose.style.visibility='visible';
    $transitionClose.src='./images/transition-close.gif';

}



// Open transition
function openTransition(){

    console.log('6) Opening transition');

    $transitionClose.style.visibility='hidden';
    $transitionOpen.style.visibility='visible';
    $transitionOpen.src='./images/transition-open.gif';

}



// Delay function
function delay(t, v){
    return new Promise(function(resolve){ 
        setTimeout(resolve.bind(null, v), t)
    });
}



// Get quiz content 
async function loadData() {

    console.log('1) Loading JSON data');

    var response = await fetch('data/quiz_data.json');
    var json = await response.json();
    return json;

};



// Load the quiz into DOM
function applyData(data, quizNumber, quizItemNumber){

    console.log('5) Applying data');

    // Data variables
    var quiz        =   data.quizzes[quizNumber];
    var quizItem    =   quiz.quizItems[quizItemNumber];

    // DOM elements
    var $artistText     =   document.getElementById('artist-text');
    var $questionText   =   document.getElementById('question-text');
    var $artistImage    =   document.getElementById('artist-image');
    var $answerA        =   document.getElementById('answer-a');
    var $answerB        =   document.getElementById('answer-b');
    var $answerC        =   document.getElementById('answer-c');

    // Update DOM elements with values from data
    $artistText.innerHTML = quiz.quizName;
    $questionText.innerHTML = quizItem.question;
    $artistImage.style.backgroundImage = "url('" + quizItem.imagePath + "')";
    $answerA.innerHTML = "A) " + quizItem.answers[0];
    $answerB.innerHTML = "B) " + quizItem.answers[1];
    $answerC.innerHTML = "C) " + quizItem.answers[2];
    
}



// Quiz item is active
async function quizItemActive(data, quizNumber, quizItemNumber, seconds){

    // Promise for asynchronous setInterval
    return await new Promise(resolve => {

        console.log('7) Started quiz item');

        // Time input
        seconds = seconds || 15; // 15 seconds by default

        // Update the timer DOM element
        var $timer = document.getElementById("timer");
        $timer.innerHTML = seconds;

        // Set an interval
        const interval = setInterval(() => {

            // Lower the countdown variable
            seconds--;
    
            // Display countdown
            if(seconds >= 0){
                $timer.innerHTML = seconds;
            }

            // Exactly when the time is up
            if(seconds == 0) {

                // Display a the 'time is up' message
                document.getElementById("timer-message").style.display = "block";

            }
            // One second after the time is up
            else if(seconds == -1){

                // Get the correct answer
                var correctQuizAnswer = data.quizzes[quizNumber].quizItems[quizItemNumber].correctAnswerIndex;

                // If the correct answer is A, display it
                if(correctQuizAnswer == 0){
                    document.getElementById("answer-a").style.backgroundColor = "#00ff80"
                }
                // If the correct answer is B, display it
                else if(correctQuizAnswer == 1){
                    document.getElementById("answer-b").style.backgroundColor = "#00ff80"
                }
                // If the correct answer is C, display it 
                else if(correctQuizAnswer == 2){
                    document.getElementById("answer-c").style.backgroundColor = "#00ff80"
                }

            }
            // Ten seconds after the time is up
            else if(seconds == -10) {

                // Clear the interval and resolve the promise
                clearInterval(interval);
                resolve();

            }

        }, 1000);

    });

}



// Quiz item reset
function quizItemReset(){

    console.log('4) Resetting quiz item');

    // DOM elements
    var $artistText     =   document.getElementById('artist-text');
    var $questionText   =   document.getElementById('question-text');
    var $artistImage    =   document.getElementById('artist-image');
    var $answerA        =   document.getElementById('answer-a');
    var $answerB        =   document.getElementById('answer-b');
    var $answerC        =   document.getElementById('answer-c');
    var $timer          =   document.getElementById('timer');
    var $timerMessage   =   document.getElementById('timer-message');
    
    // Update DOM elements with default placeholder values
    $artistText.innerHTML               =   "Placeholder";
    $questionText.innerHTML             =   "Placeholder";
    $artistImage.style.backgroundImage  =   "url('../images/placeholder.png')";
    $answerA.innerHTML                  =   "Placeholder";
    $answerB.innerHTML                  =   "Placeholder";
    $answerC.innerHTML                  =   "Placeholder";
    $answerA.style.backgroundColor      =   "#ffe600";
    $answerB.style.backgroundColor      =   "#ffe600";
    $answerC.style.backgroundColor      =   "#ffe600";
    $timer.innerHTML                    =   "N";
    $timerMessage.style.display         =   "none";

}



// Switch to the provided screen
function switchScreens(screen){

    // Switch
    if(screen == 1){
        $screenStarting.style.visibility    =   'visible';
        $screenQuestions.style.visibility   =   'hidden';
        $screenEnding.style.visibility      =   'hidden';
    }
    else if(screen == 2){
        $screenStarting.style.visibility    =   'hidden';
        $screenQuestions.style.visibility   =   'visible';
        $screenEnding.style.visibility      =   'hidden';
    }
    else if(screen == 3){
        $screenStarting.style.visibility    =   'hidden';
        $screenQuestions.style.visibility   =   'hidden';
        $screenEnding.style.visibility      =   'visible';
    }

}