Due to loading other html pages inside itself, it has to be executed through the http: protocol, and not the standard file: protocol when opening the html file with your browser.
I set up a gamerunner.sh file that sets up a python http server to tackle this problem.
Actual API is inside the "script.js" file.