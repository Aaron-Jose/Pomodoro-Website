document.addEventListener('DOMContentLoaded', () => {

  const countDownDate = new Date("May 15, 2023").getTime(); // Change the date to whatever you want to count down to
  const countDownTitle = "days..."; // put whatever you want to count down to in the speech marks

  let timeLeft = 0; // 25 minutes in seconds
  let timerId;
  let totalTime = 0;
  let isWorking = false; // keep track of whether we're in a work period or a break period
  let isLongBreak = false; // keep track of whether the next break period should be a long break
  let breakvar = 0;
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const restartBtn = document.getElementById('restart-btn');
  const helpbtn = document.getElementById("HelpIcon");
  const musicbtn = document.getElementById("musicIcon");
  const helpinfo = document.getElementById("sliding-text");
  const btnContainer = document.querySelector(".btn-container");
  const timerContainer = document.querySelector(".timer-container");
  const titleContainer = document.querySelector(".title");
  const audio = new Audio('ding.wav'); // Replace 'path/to/sound.mp3' with the actual path to your sound file
  const music = new Audio('song.mp3');
  const timeStudy = 25 * 1;
  const timeSBreak = 5 * 1;
  const timeLBreak = 35 * 1;
  let mode = 'study';

  // Hide the Pause and Restart buttons initially
  pauseBtn.style.display = 'none';
  restartBtn.style.display = 'none';

  audio.volume = 0.3;

  function startTimer() {
    clearInterval(timerId); // clear previous interval
    timerId = setInterval(() => {
      displayTime(); // display the updated total time elapsed
      displayTotalTime();

      if (timeLeft === 0) {
        clearInterval(timerId);
        audio.play(); // play the sound when the timer ends

        if (isWorking) {
          timeLeft = timeSBreak; // 5-minute break period
          isWorking = false;

          if (breakvar === 4) {
            isLongBreak = true;
            timeLeft = timeLBreak; // 35-minute break period
            breakvar = 0;
            mode = 'long break';
          } else {
            isLongBreak = false;
            breakvar++;
            mode = 'short break';
          }

        } else {
          timeLeft = timeStudy; // 25-minute work period
          isWorking = true;
          mode = 'study';
        }

        displayTime();
        displayTotalTime();
        startTimer();
         // start the timer again with the new time period
      }

      timeLeft--;
      totalTime++;

      
      titleUpdate();
    }, 1000);

    // Show the Pause and Restart buttons, hide the Start button
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'block';
    restartBtn.style.display = 'block';
  }

  function titleUpdate() {
    if (mode === 'study') {
      titleid.innerHTML = "Study Period";
    } else if (mode === 'short break'){
      titleid.innerHTML = "Short Break";
    } else if (mode === 'long break'){
      titleid.innerHTML = "Long Break";
    }

  }

  function pauseTimer() {
    clearInterval(timerId);
    titleid.innerHTML = "Paused";
    pauseBtn.textContent = 'Resume'; // change text of the button to 'Resume'
    pauseBtn.removeEventListener('click', pauseTimer); // remove pauseTimer event listener
    pauseBtn.addEventListener('click', resumeTimer); // add resumeTimer event listener
  }

  function resumeTimer() {
    pauseBtn.textContent = 'Pause'; // change text of the button back to 'Pause'
    pauseBtn.removeEventListener('click', resumeTimer); // remove resumeTimer event listener
    pauseBtn.addEventListener('click', pauseTimer); // add pauseTimer event listener
    startTimer(); // start the timer again
  }

  function restartTimer() {
    clearInterval(timerId);
    timeLeft = timeStudy; // reset timer to 25 minutes
    titleid.innerHTML = "Press Start To Begin";
    totalTime = 0;
    isWorking = true;
    isLongBreak = false;
    displayTime();
    displayTotalTime();
    // Hide the Pause and Restart buttons, show the Start button
    startBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
    restartBtn.style.display = 'none';
  }

  restartTimer()

  function displayTime() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    
    document.getElementById('timer').textContent = `${formattedMinutes}:${formattedSeconds}`;
  }

  function displayTotalTime() {
    const Thours = Math.floor(totalTime / 3600);
    const Tminutes = Math.floor(totalTime / 60) % 60;
    const formattedTotalHours = Thours < 10 ? `0${Thours}` : Thours;
    const formattedTotalMinutes = Tminutes < 10 ? `0${Tminutes}` : Tminutes;

    document.getElementById('total-time').textContent = `total time elapsed: ${formattedTotalHours}:${formattedTotalMinutes}`;
  }  

  function transitionHelp() {
    helpinfo.classList.toggle("animate");
  }

  function toggleAudio() {
    if (music.paused) { // Check if the audio is paused
      music.play(); // If it is paused, play the audio
    } else {
      music.pause(); // If it is playing, pause the audio
    }
  }

  function countdown() {
    const now = new Date().getTime();
    const distance = countDownDate - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    document.getElementById("countdown").textContent = days +" "+ countDownTitle;
  }

  music.addEventListener('ended', function() {
    music.currentTime = 0; // reset the playback position to the beginning
    music.play(); // restart the audio playback
  });

  helpbtn.addEventListener("click", function() {
    btnContainer.classList.toggle("hidden");
    timerContainer.classList.toggle("hidden");
    titleContainer.classList.toggle("hidden");
    document.getElementById("countdown").classList.toggle("hidden");
  });

  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  restartBtn.addEventListener('click', restartTimer);
  helpbtn.addEventListener('click', transitionHelp);
  musicbtn.addEventListener('click', toggleAudio);

  displayTime();
  displayTotalTime();
  countdown();
  
});