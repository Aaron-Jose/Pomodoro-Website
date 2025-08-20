var pomodoro = 3600000;
var isPomodoro = true;
var shortBreak = 600000;
var longBreak = 1200000;
var longBreakInterval = 4;
var sessionCount = 0;

var timer, temptimer, timerInterval;

const audio = new Audio("ding.wav");
audio.volume = 0.8;

document.addEventListener("DOMContentLoaded", function () {
  resetTimer();
});

function currentTime() {
  document.getElementById("periodLabel").value = "Current Time";
  const d = new Date();
  var Hour = String(d.getUTCHours()).padStart(2, "0");
  var Minutes = String(d.getUTCMinutes()).padStart(2, "0");
  var Seconds = String(d.getUTCSeconds()).padStart(2, "0");

  document.getElementById("one").innerHTML = Hour.charAt(0);
  document.getElementById("two").innerHTML = Hour.charAt(1);
  document.getElementById("three").innerHTML = Minutes.charAt(0);
  document.getElementById("four").innerHTML = Minutes.charAt(1);
  document.getElementById("five").innerHTML = Seconds.charAt(0);
  document.getElementById("six").innerHTML = Seconds.charAt(1);

  document.getElementById("signifier").innerHTML = d
    .toLocaleTimeString()
    .slice(-2);
}

function updateTimer() {
  const d = new Date(timer);
  var Hour = String(d.getUTCHours()).padStart(2, "0");
  var Minutes = String(d.getUTCMinutes()).padStart(2, "0");
  var Seconds = String(d.getUTCSeconds()).padStart(2, "0");

  document.getElementById("one").innerHTML = Hour.charAt(0);
  document.getElementById("two").innerHTML = Hour.charAt(1);
  document.getElementById("three").innerHTML = Minutes.charAt(0);
  document.getElementById("four").innerHTML = Minutes.charAt(1);
  document.getElementById("five").innerHTML = Seconds.charAt(0);
  document.getElementById("six").innerHTML = Seconds.charAt(1);
}

function updatedisabled() {
  document.getElementById("Start").classList.toggle("disabled");
  document.getElementById("Pause").classList.toggle("disabled");
  document.getElementById("Reset").classList.toggle("disabled");

  if (document.getElementById("Start").disabled == true) {
    document.getElementById("Start").disabled = false;
    document.getElementById("Pause").disabled = true;
    document.getElementById("Reset").disabled = true;
  } else {
    document.getElementById("Start").disabled = true;
    document.getElementById("Pause").disabled = false;
    document.getElementById("Reset").disabled = false;
  }
}

function myTimer() {
  document.getElementById("signifier").style.display = "none";
  if (Math.round(timer) <= 0) {
    console.log("ding");
    audio.play();

    if (isPomodoro == true) {
      sessionCount = sessionCount + 1
      isPomodoro = false
    } else {
      isPomodoro = true
    }

    resetTimer();
  }
  updateTimer();

  timer = timer - 1000;
}

function startPomodoro() {
  clearInterval(timerInterval);

  if (isPomodoro == false) {
    if (sessionCount % longBreakInterval == 0) {
      timer = longBreak;
      document.getElementById("periodLabel").innerHTML = "LONG BREAK";
      console.log("long break");
    } else {
      timer = shortBreak;
      document.getElementById("periodLabel").innerHTML = "SHORT BREAK";
      console.log("short break");
    }
  } else {
    timer = pomodoro;
    document.getElementById("periodLabel").innerHTML = "STUDY PERIOD";
    console.log("pomodoro");
  }

  updatedisabled();

  timerInterval = setInterval(myTimer, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  document.getElementById("periodLabel").innerHTML = "TIMER PAUSED";
  updatedisabled();

  document.getElementById("Start").innerHTML = "Resume";
  document.getElementById("Start").onclick = resumeTimer;
}

function resumeTimer() {
  clearInterval(timerInterval);
  document.getElementById("periodLabel").innerHTML = "TIMER PAUSED";

  document.getElementById("Start").innerHTML = "Start";
  document.getElementById("Start").onclick = startPomodoro;

  updatedisabled();
  timerInterval = setInterval(myTimer, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);

  const storedData = localStorage.getItem("userSettings");

  if (storedData) {
    const parsedData = JSON.parse(storedData);
    pomodoro = parsedData["pomodoro"] * 1000;
    shortBreak = parsedData["shortBreak"] * 1000;
    longBreak = parsedData["longBreak"] * 1000;

    longBreakInterval = parsedData["longBreakInterval"];
  }
  timerInterval = setInterval(currentTime, 1000);

  updatedisabled();
}
