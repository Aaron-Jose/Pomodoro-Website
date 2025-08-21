// Using "DOMContentLoaded" ensures the script runs only after the entire HTML document has been loaded and parsed.
document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  //   1. CONFIGURATION & STATE MANAGEMENT
  // =========================================================================
  let TIMER_DURATIONS = {};
  let autoStartEnabled = false;
  let pomodoroCycle = 0; // Tracks pomodoros for long breaks

  const state = {
    currentMode: "pomodoro",
    remainingTime: 0,
    isRunning: false,
    timerInterval: null,
  };
  const completionSound = new Audio("ding.wav");

  // =========================================================================
  //   2. DOM ELEMENT CACHING
  // =========================================================================
  const elements = {
    minutesDisplay: document.getElementById("minutes"),
    secondsDisplay: document.getElementById("seconds"),
    startStopBtn: document.getElementById("start-stop-btn"),
    resetBtn: document.getElementById("reset-btn"),
    pomodoroBtn: document.getElementById("pomodoro-btn"),
    shortBreakBtn: document.getElementById("short-break-btn"),
    longBreakBtn: document.getElementById("long-break-btn"),
    timerButtons: document.querySelectorAll(".timer-btn"),
  };

  // =========================================================================
  //   3. CORE FUNCTIONS
  // =========================================================================

  /**
   * Reads all settings from localStorage and initializes the timer.
   */
  function initializeTimer() {
    const pomodoro = localStorage.getItem("pomodoroDuration") || 25;
    const shortBreak = localStorage.getItem("shortBreakDuration") || 5;
    const longBreak = localStorage.getItem("longBreakDuration") || 15;
    autoStartEnabled = localStorage.getItem("autoStartEnabled") === "true";

    TIMER_DURATIONS = {
      pomodoro: parseInt(pomodoro) * 60,
      shortBreak: parseInt(shortBreak) * 60,
      longBreak: parseInt(longBreak) * 60,
    };

    stopTimer();
    setMode("pomodoro"); // Set mode on initialization
  }

  /**
   * Updates the timer display on the page and in the document title.
   */
  function updateDisplay() {
    const minutes = Math.floor(state.remainingTime / 60);
    const seconds = state.remainingTime % 60;
    elements.minutesDisplay.textContent = String(minutes).padStart(2, "0");
    elements.secondsDisplay.textContent = String(seconds).padStart(2, "0");
    document.title = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")} - ${state.currentMode}`;
  }

  /**
   * Starts the countdown timer.
   */
  function startTimer() {
    if (state.isRunning) return;
    state.isRunning = true;
    elements.startStopBtn.textContent = "PAUSE";
    state.timerInterval = setInterval(() => {
      state.remainingTime--;
      updateDisplay();
      if (state.remainingTime < 0) {
        handleSessionCompletion();
      }
    }, 1000);
  }

  /**
   * Stops or pauses the countdown timer.
   */
  function stopTimer() {
    clearInterval(state.timerInterval);
    state.isRunning = false;
    elements.startStopBtn.textContent = "START";
  }

  /**
   * Sets the timer to a specific mode and updates the UI.
   * @param {string} mode - The timer mode to switch to.
   */
  function setMode(mode) {
    stopTimer();
    state.currentMode = mode;
    state.remainingTime = TIMER_DURATIONS[mode];

    // *** FIX: Correctly handle button highlighting ***
    const modeToId = {
      pomodoro: "pomodoro-btn",
      shortBreak: "short-break-btn",
      longBreak: "long-break-btn",
    };

    // Remove active class from all buttons first
    elements.timerButtons.forEach((btn) => btn.classList.remove("active"));

    // Add active class to the correct button
    const activeButton = document.getElementById(modeToId[mode]);
    if (activeButton) {
      activeButton.classList.add("active");
    }

    updateDisplay();
  }

  /**
   * Handles the logic for when a timer session completes.
   */
  function handleSessionCompletion() {
    stopTimer();
    completionSound.play();

    const lastMode = state.currentMode;

    if (lastMode === "pomodoro") {
      logPomodoroCompletion();
      pomodoroCycle++;
      const nextMode = pomodoroCycle % 4 === 0 ? "longBreak" : "shortBreak";
      setMode(nextMode);
    } else {
      setMode("pomodoro");
    }

    // *** This will now work as expected because the visual state is correct ***
    if (autoStartEnabled) {
      startTimer();
    }
  }

  /**
   * Logs a completed Pomodoro session in localStorage.
   */
  function logPomodoroCompletion() {
    const today = new Date().toISOString().split("T")[0]; // Get date in YYYY-MM-DD format

    // Get existing stats or create a new object
    const stats = JSON.parse(localStorage.getItem("pomodoroStats")) || {
      total: 0,
      daily: {}
    };

    // Update total
    stats.total = (stats.total || 0) + 1;

    // Update today's count
    stats.daily[today] = (stats.daily[today] || 0) + 1;

    // Save back to localStorage
    localStorage.setItem("pomodoroStats", JSON.stringify(stats));
  }

  // =========================================================================
  //   4. EVENT LISTENERS
  // =========================================================================
  elements.startStopBtn.addEventListener("click", () =>
    state.isRunning ? stopTimer() : startTimer()
  );
  elements.resetBtn.addEventListener("click", () => {
    stopTimer();
    state.remainingTime = TIMER_DURATIONS[state.currentMode];
    updateDisplay();
  });
  elements.pomodoroBtn.addEventListener("click", () => setMode("pomodoro"));
  elements.shortBreakBtn.addEventListener("click", () => setMode("shortBreak"));
  elements.longBreakBtn.addEventListener("click", () => setMode("longBreak"));
  window.addEventListener("pageshow", initializeTimer);
});
