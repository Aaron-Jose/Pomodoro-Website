// Using "DOMContentLoaded" ensures the script runs only after the entire HTML document has been loaded and parsed.
document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    //   1. CONFIGURATION & STATE MANAGEMENT
    // =========================================================================
    let TIMER_DURATIONS = {};
    const state = {
        currentMode: 'pomodoro',
        remainingTime: 0,
        isRunning: false,
        timerInterval: null,
    };
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
     * Reads settings from localStorage and initializes the timer.
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

        stopTimer();
        state.currentMode = 'pomodoro';
        state.remainingTime = TIMER_DURATIONS.pomodoro;
        
        elements.timerButtons.forEach(btn => {
            btn.classList.toggle('active', btn.id === 'pomodoro-btn');
        });

        updateDisplay();
    }

    /**
     * Updates the timer display on the page and in the document title.
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
            if (state.remainingTime < 0) {
                stopTimer();
                completionSound.play();
                
                // NEW: Log the completion if it was a pomodoro session
                if (state.currentMode === 'pomodoro') {
                    logPomodoroCompletion();
                }

                // Suggest the next logical mode (e.g., a break after a pomodoro)
                // This is a placeholder for more advanced logic if you want it
                
                // Reset to the beginning of the next logical session
                // For now, we just reset the current one
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
     * Sets the timer to a specific mode.
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

    /**
     * NEW: Logs a completed Pomodoro session in localStorage.
     */
    function logPomodoroCompletion() {
        const today = new Date().toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
        
        // Get existing stats or create a new object
        const stats = JSON.parse(localStorage.getItem('pomodoroStats')) || {
            total: 0,
            daily: {}
        };

        // Update total
        stats.total = (stats.total || 0) + 1;

        // Update today's count
        stats.daily[today] = (stats.daily[today] || 0) + 1;

        // Save back to localStorage
        localStorage.setItem('pomodoroStats', JSON.stringify(stats));
    }


    // =========================================================================
    //   4. EVENT LISTENERS
    // =========================================================================

    elements.startStopBtn.addEventListener('click', () => {
        state.isRunning ? stopTimer() : startTimer();
    });

    elements.resetBtn.addEventListener('click', resetTimer);
    elements.pomodoroBtn.addEventListener('click', () => setMode('pomodoro'));
    elements.shortBreakBtn.addEventListener('click', () => setMode('shortBreak'));
    elements.longBreakBtn.addEventListener('click', () => setMode('longBreak'));

    window.addEventListener('pageshow', () => {
        initializeTimer();
    });

});
