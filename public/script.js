// Using "DOMContentLoaded" ensures the script runs only after the entire HTML document has been loaded and parsed.
document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    //   1. CONFIGURATION & STATE MANAGEMENT
    // =========================================================================

    // An object to hold timer durations. It will be populated by reading from localStorage.
    let TIMER_DURATIONS = {};

    // An object to manage the application's state.
    const state = {
        currentMode: 'pomodoro',
        remainingTime: 0, // Will be set during initialization
        isRunning: false,
        timerInterval: null,
    };

    // Sound for when the timer completes.
    const completionSound = new Audio('ding.wav');

    // =========================================================================
    //   2. DOM ELEMENT CACHING
    // =========================================================================

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
     * Reads the latest settings from localStorage and updates the timer state.
     * This is the core of the fix, ensuring settings are always fresh.
     */
    function initializeTimer() {
        const pomodoro = localStorage.getItem('pomodoroDuration') || 25;
        const shortBreak = localStorage.getItem('shortBreakDuration') || 5;
        const longBreak = localStorage.getItem('longBreakDuration') || 15;

        TIMER_DURATIONS = {
            pomodoro: parseInt(pomodoro) * 60,
            shortBreak: parseInt(shortBreak) * 60,
            longBreak: parseInt(longBreak) * 60,
        };

        // Stop any running timer and apply the new settings.
        stopTimer();
        state.currentMode = 'pomodoro';
        state.remainingTime = TIMER_DURATIONS.pomodoro;
        
        // Make sure the "Pomodoro" button is shown as active.
        elements.timerButtons.forEach(btn => {
            btn.classList.toggle('active', btn.id === 'pomodoro-btn');
        });

        updateDisplay();
    }

    /**
     * Updates the timer display (minutes and seconds) on the page.
     */
    function updateDisplay() {
        const minutes = Math.floor(state.remainingTime / 60);
        const seconds = state.remainingTime % 60;
        elements.minutesDisplay.textContent = String(minutes).padStart(2, '0');
        elements.secondsDisplay.textContent = String(seconds).padStart(2, '0');
        document.title = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} - Pomodoro`;
    }

    /**
     * Starts the countdown timer.
     */
    function startTimer() {
        if (state.isRunning) return;
        state.isRunning = true;
        elements.startStopBtn.textContent = 'PAUSE';
        state.timerInterval = setInterval(() => {
            state.remainingTime--;
            updateDisplay();
            if (state.remainingTime < 0) { // Changed to < 0 to ensure it fires correctly
                stopTimer();
                completionSound.play();
                // Reset to the beginning of the current mode's duration
                state.remainingTime = TIMER_DURATIONS[state.currentMode];
                updateDisplay();
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
        stopTimer();
        state.currentMode = mode;
        state.remainingTime = TIMER_DURATIONS[mode];
        elements.timerButtons.forEach(btn => {
            btn.classList.toggle('active', btn.id === `${mode}-btn`);
        });
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

    elements.startStopBtn.addEventListener('click', () => {
        if (state.isRunning) {
            stopTimer();
        } else {
            startTimer();
        }
    });

    elements.resetBtn.addEventListener('click', resetTimer);
    elements.pomodoroBtn.addEventListener('click', () => setMode('pomodoro'));
    elements.shortBreakBtn.addEventListener('click', () => setMode('shortBreak'));
    elements.longBreakBtn.addEventListener('click', () => setMode('longBreak'));

    // Listen for the 'pageshow' event. This fires on initial load AND when
    // navigating back to the page, ensuring settings are always fresh.
    window.addEventListener('pageshow', (event) => {
        // The 'persisted' property is true if the page is from a back/forward cache.
        // We want to re-initialize in both cases to be safe.
        initializeTimer();
    });

});
