var pomodoro = 3600000;
var isPomodoro = true;
var timerLabel = "";
var shortBreak = 600000;
var longBreak = 1200000;
var is24hr = true;
var longBreakInterval = 4;
var sessionCount = 0;
var timerPaused = false;

var timer, temptimer, timerInterval;

const audio = new Audio("ding.wav");
audio.volume = 0.8;

document.addEventListener("DOMContentLoaded", function () {
  const storedData = localStorage.getItem("userSettings");

  if (storedData) {
    const parsedData = JSON.parse(storedData);
    pomodoro = parsedData["pomodoro"] * 60000;
    shortBreak = parsedData["shortBreak"] * 60000;
    longBreak = parsedData["longBreak"] * 60000;

    longBreakInterval = parsedData["longBreakInterval"];
    is24hr = parsedData["twentyfourhr"];
  }

  resetTimer();
});

function updatedisabled() {
  document.getElementById("Start").classList.toggle("disabled");
  document.getElementById("Pause").classList.toggle("disabled");

  if ((document.getElementById("Start").disabled == true)) {
    document.getElementById("Start").disabled = false;
    document.getElementById("Pause").disabled = true;
  } else {
    document.getElementById("Start").disabled = true;
    document.getElementById("Pause").disabled = false;
  }
}

function displayTime(date) {
  var Hour = String(date.getUTCHours()).padStart(2, "0");
  var Minutes = String(date.getUTCMinutes()).padStart(2, "0");
  var Seconds = String(date.getUTCSeconds()).padStart(2, "0");

  if (is24hr == false) {
    if (parseInt(Hour) > 12) {
      Hour = String(parseInt(Hour) - 12).padStart(2, "0");
    }

    document.getElementById("signifier").innerHTML = date
      .toLocaleTimeString()
      .slice(-2);
  }

  document.getElementById("one").innerHTML = Hour.charAt(0);
  document.getElementById("two").innerHTML = Hour.charAt(1);
  document.getElementById("three").innerHTML = Minutes.charAt(0);
  document.getElementById("four").innerHTML = Minutes.charAt(1);
  document.getElementById("five").innerHTML = Seconds.charAt(0);
  document.getElementById("six").innerHTML = Seconds.charAt(1);
}

function currentTime() {
  document.getElementById("periodLabel").value = "Current Time";
  displayTime(new Date());
}

function updateTimer() {
  displayTime(new Date(timer));
}

function myTimer() {
  document.getElementById("signifier").style.display = "none";
  if (Math.round(timer) <= 0) {
    console.log("ding");
    audio.play();

    if (isPomodoro == true) {
      sessionCount = sessionCount + 1;
      isPomodoro = false;
    } else {
      isPomodoro = true;
    }

    resetTimer();
  }
  updateTimer();

  timer = timer - 1000;
}

function updateLabel() {
  document.getElementById("periodLabel").innerHTML = timerLabel;
}

function autoUpdateLabel() {
  if (isPomodoro == false) {
    if (sessionCount % longBreakInterval == 0) {
      timerLabel = "LONG BREAK";
      console.log("long break");
    } else {
      timerLabel = "SHORT BREAK";
      console.log("short break");
    }
  } else {
    timerLabel = "STUDY PERIOD";
  }

  updateLabel();
}

function pressedStart() {
  if (timerPaused == true) {
    resumeTimer();
  } else {
    startPomodoro();
  }
}

function startPomodoro() {
  console.log("starting timer");
  clearInterval(timerInterval);

  autoUpdateLabel();

  if (isPomodoro == false) {
    if (sessionCount % longBreakInterval == 0) {
      timer = longBreak;
    } else {
      timer = shortBreak;
    }
  } else {
    timer = pomodoro;
  }

  updatedisabled();

  timerInterval = setInterval(myTimer, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerLabel = "TIMER PAUSED";
  updateLabel();

  console.log(timer);

  document.getElementById("Start").innerHTML = "Resume";
  timerPaused = true;

  updatedisabled();
}

function resumeTimer() {
  clearInterval(timerInterval);
  autoUpdateLabel();

  document.getElementById("Start").innerHTML = "Start";
  timerPaused = false;

  updatedisabled();

  timerInterval = setInterval(myTimer, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerLabel = "Current Time";
  document.getElementById("Start").innerHTML = "Start";
  
  if (document.getElementById("Start").disabled == true) {
    updatedisabled();
  }


  timerPaused = false;
  isPomodoro = true;
  sessionCount = 0


  updateLabel();
  timerInterval = setInterval(currentTime, 1000);
}
