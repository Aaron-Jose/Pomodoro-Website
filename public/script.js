// Using "DOMContentLoaded" ensures the script runs only after the entire HTML document has been loaded and parsed.
document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    //   1. CONFIGURATION & STATE MANAGEMENT
    // =========================================================================

    // An object to hold timer durations in seconds.
    // This avoids "magic numbers" and makes configuration easy to manage.
    const TIMER_DURATIONS = {
        pomodoro: 25 * 60,   // 25 minutes
        shortBreak: 5 * 60,    // 5 minutes
        longBreak: 15 * 60,  // 15 minutes
    };

    // An object to manage the application's state.
    // This centralizes state, making it easier to track and debug.
    const state = {
        currentMode: 'pomodoro', // Default mode
        remainingTime: TIMER_DURATIONS.pomodoro,
        isRunning: false,
        timerInterval: null,
    };

    // Sound for when the timer completes.
    const completionSound = new Audio('ding.wav');

    // =========================================================================
    //   2. DOM ELEMENT CACHING
    // =========================================================================

    // Caching DOM elements improves performance by avoiding repeated queries.
    const elements = {
        minutesDisplay: document.getElementById('minutes'),
        secondsDisplay: document.getElementById('seconds'),
        startStopBtn: document.getElementById('start-stop-btn'),
        resetBtn: document.getElementById('reset-btn'),
        pomodoroBtn: document.getElementById('pomodoro-btn'),
        shortBreakBtn: document.getElementById('short-break-btn'),
        longBreakBtn: document.getElementById('long-break-btn'),
        timerButtons: document.querySelectorAll('.timer-btn'),
    };

    // =========================================================================
    //   3. CORE FUNCTIONS
    // =========================================================================

    /**
     * Updates the timer display (minutes and seconds) on the page.
     */
    function updateDisplay() {
        const minutes = Math.floor(state.remainingTime / 60);
        const seconds = state.remainingTime % 60;

        // Pad with a leading zero if the number is less than 10.
        elements.minutesDisplay.textContent = String(minutes).padStart(2, '0');
        elements.secondsDisplay.textContent = String(seconds).padStart(2, '0');

        // Update the browser tab title to show the current time.
        document.title = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} - Pomodoro`;
    }

    /**
     * Starts the countdown timer.
     */
    function startTimer() {
        if (state.isRunning) return; // Prevent multiple intervals.

        state.isRunning = true;
        elements.startStopBtn.textContent = 'PAUSE';

        // Using HackTimer's setInterval for better accuracy when tab is in background.
        state.timerInterval = setInterval(() => {
            state.remainingTime--;
            updateDisplay();

            if (state.remainingTime <= 0) {
                stopTimer();
                completionSound.play();
                // Optionally, you can add logic here to auto-start the next session.
            }
        }, 1000);
    }

    /**
     * Stops or pauses the countdown timer.
     */
    function stopTimer() {
        clearInterval(state.timerInterval);
        state.isRunning = false;
        elements.startStopBtn.textContent = 'START';
    }

    /**
     * Sets the timer to a specific mode ('pomodoro', 'shortBreak', 'longBreak').
     * @param {string} mode - The timer mode to switch to.
     */
    function setMode(mode) {
        // Clear any existing timer.
        stopTimer();

        state.currentMode = mode;
        state.remainingTime = TIMER_DURATIONS[mode];

        // Update the active button style.
        elements.timerButtons.forEach(btn => {
            btn.classList.toggle('active', btn.id === `${mode}-btn`);
        });

        // Update the display for the new mode.
        updateDisplay();
    }

    /**
     * Resets the timer to the beginning of the current mode.
     */
    function resetTimer() {
        stopTimer();
        state.remainingTime = TIMER_DURATIONS[state.currentMode];
        updateDisplay();
    }

    // =========================================================================
    //   4. EVENT LISTENERS
    // =========================================================================

    // Toggle between starting and stopping the timer.
    elements.startStopBtn.addEventListener('click', () => {
        if (state.isRunning) {
            stopTimer();
        } else {
            startTimer();
        }
    });

    // Reset button functionality.
    elements.resetBtn.addEventListener('click', resetTimer);

    // Mode selection buttons.
    elements.pomodoroBtn.addEventListener('click', () => setMode('pomodoro'));
    elements.shortBreakBtn.addEventListener('click', () => setMode('shortBreak'));
    elements.longBreakBtn.addEventListener('click', () => setMode('longBreak'));

    // =========================================================================
    //   5. INITIALIZATION
    // =========================================================================

    // Set the initial display when the page loads.
    updateDisplay();

});
