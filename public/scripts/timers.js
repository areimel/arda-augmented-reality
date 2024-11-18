function SessionTimer(elementID){
    const timer = new Timer();
    timer.start();

    timer.addEventListener('secondsUpdated', function () {
        document.querySelector(`${elementID}`).innerHTML  = (timer.getTimeValues().toString());
    });
}

function StopWatchTimer(elementID){
    const timer = new Timer();
    document.querySelector('#chronoExample .startButton').addEventListener('click', function() {
        timer.start();
    }, false);
    document.querySelector('#chronoExample .pauseButton').addEventListener('click', function() {
        timer.pause();
    }, false);
    document.querySelector('#chronoExample .stopButton').addEventListener('click', function() {
        timer.stop();
    }, false);
    document.querySelector('#chronoExample .resetButton').addEventListener('click', function() {
        timer.stop();
        timer.start();
    }, false);

    timer.addEventListener('secondsUpdated', function () {
        document.querySelector('#chronoExample .values').innerHTML = (timer.getTimeValues().toString());
    });

    timer.addEventListener('started', function () {
        document.querySelector('#chronoExample .values').innerHTML = (timer.getTimeValues().toString());
    });

    timer.addEventListener('reset', function () {
        document.querySelector('#chronoExample .values').innerHTML = (timer.getTimeValues().toString());
    });
}

function PomodoroTimer(elementID, timer1Time, timer2Time, timer1ResetText, timer2ResetText, timer1EndMessage, timer2EndMessage){
    const timer1 = new Timer();
    const timer2 = new Timer();
    
    function timer1Start(seconds){
        timer1.start({countdown: true, startValues: {seconds: seconds}});
    }
    function timer2Start(seconds){
        timer2.start({countdown: true, startValues: {seconds: seconds}});
    }

    function messageFlash(text){
        document.querySelector(`${elementID} .message`).innerHTML = text;
        setTimeout(() => {
            document.querySelector(`${elementID} .message`).innerHTML = "";
        }, 2000); //time in ms
    }
    
    function timer1Behavior(){
        //document.querySelector('#pomodoroTimerTest .timer1').innerHTML = timer1.getTimeValues().toString();
        document.querySelector(`${elementID} .timer1`).innerHTML = timer1.getTimeValues().toString();

        timer1.addEventListener('secondsUpdated', function () {
            document.querySelector(`${elementID} .timer1`).innerHTML = timer1.getTimeValues().toString();
        });

        timer1.addEventListener('targetAchieved', function () {
            messageFlash(timer1EndMessage);
            timer2Start(timer2Time);
            document.querySelector(`${elementID} .timer1`).innerHTML = timer1ResetText;
        });
    }

    function timer2Behavior(){
        document.querySelector(`${elementID} .timer2`).innerHTML = timer2.getTimeValues().toString();

        timer2.addEventListener('secondsUpdated', function () {
            document.querySelector(`${elementID} .timer2`).innerHTML = timer2.getTimeValues().toString();
        });

        timer2.addEventListener('targetAchieved', function () {
            messageFlash(timer2EndMessage);
            timer1Start(timer1Time);
            document.querySelector(`${elementID} .timer2`).innerHTML = timer2ResetText;
        });
    }

    //Run Functions
    timer1Behavior();
    timer2Behavior();
    timer1Start(timer1Time);
}


//Run Functions - move to on-page
document.addEventListener("DOMContentLoaded", function(){
    SessionTimer("#sessionTimer");
    StopWatchTimer();
    //PomodoroTimer("#pomodoroTimerTest", 30, 10);

    elementID = "#pomodoroTimerTest";
    timer1Time = 30;
    timer2Time = 10;
    timer1ResetText = "00:00:30";
    timer2ResetText = "00:00:10";
    timer1EndMessage = "Timer 1 complete, flipping to Timer 2";
    timer2EndMessage = "Timer 2 complete, flipping back to Timer 1";
    PomodoroTimer(elementID, timer1Time, timer2Time, timer1ResetText, timer2ResetText, timer1EndMessage, timer2EndMessage)
});