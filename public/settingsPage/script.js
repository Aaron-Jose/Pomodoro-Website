// Wait for the HTML to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    //   DOM ELEMENT CACHING
    // =========================================================================
    const settingsForm = document.getElementById('settings-form');
    const pomodoroInput = document.getElementById('pomodoro-duration');
    const shortBreakInput = document.getElementById('short-break-duration');
    const longBreakInput = document.getElementById('long-break-duration');
    const saveConfirmation = document.getElementById('save-confirmation');

    // =========================================================================
    //   CORE FUNCTIONS
    // =========================================================================

    /**
     * Loads saved duration values from localStorage and populates the input fields.
     * This ensures that when the user visits the settings page, they see their
     * currently saved settings, not the default values.
     */
    function loadSettings() {
        // localStorage stores values as strings. Use '||' to provide a default value.
        const savedPomodoro = localStorage.getItem('pomodoroDuration') || 25;
        const savedShortBreak = localStorage.getItem('shortBreakDuration') || 5;
        const savedLongBreak = localStorage.getItem('longBreakDuration') || 15;

        pomodoroInput.value = savedPomodoro;
        shortBreakInput.value = savedShortBreak;
        longBreakInput.value = savedLongBreak;
    }

    /**
     * Handles the form submission to save the new values.
     * @param {Event} event - The form submission event.
     */
    function saveSettings(event) {
        // preventDefault stops the browser from reloading the page, which is the default form action.
        event.preventDefault();

        // Save the new values from the input fields into localStorage.
        localStorage.setItem('pomodoroDuration', pomodoroInput.value);
        localStorage.setItem('shortBreakDuration', shortBreakInput.value);
        localStorage.setItem('longBreakDuration', longBreakInput.value);

        // Show a confirmation message to the user.
        saveConfirmation.textContent = 'Settings Saved!';
        saveConfirmation.classList.add('show');

        // Hide the confirmation message after 3 seconds for a clean user experience.
        setTimeout(() => {
            saveConfirmation.classList.remove('show');
        }, 3000);
    }

    // =========================================================================
    //   EVENT LISTENERS & INITIALIZATION
    // =========================================================================

    // Listen for the form's 'submit' event and call the saveSettings function.
    settingsForm.addEventListener('submit', saveSettings);

    // Load any existing settings as soon as the page is ready.
    loadSettings();
});
