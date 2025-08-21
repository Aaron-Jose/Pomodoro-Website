// Wait for the HTML to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  //   DOM ELEMENT CACHING
  // =========================================================================
  const settingsForm = document.getElementById("settings-form");
  const pomodoroInput = document.getElementById("pomodoro-duration");
  const shortBreakInput = document.getElementById("short-break-duration");
  const longBreakInput = document.getElementById("long-break-duration");
  const autoStartToggle = document.getElementById("auto-start-toggle");
  const saveConfirmation = document.getElementById("save-confirmation");

  // =========================================================================
  //   CORE FUNCTIONS
  // =========================================================================

  /**
   * Loads all saved settings from localStorage and populates the form fields.
   * This ensures that when the user visits the settings page, they see their
   * currently saved settings, not the default values.
   */
  function loadSettings() {
    // Load duration values, providing defaults if none are saved.
    pomodoroInput.value = localStorage.getItem("pomodoroDuration") || 25;
    shortBreakInput.value = localStorage.getItem("shortBreakDuration") || 5;
    longBreakInput.value = localStorage.getItem("longBreakDuration") || 15;

    // *** FIX: Correctly load the auto-start setting. ***
    // localStorage stores everything as strings. We must compare against the
    // string 'true' to get a proper boolean value for the .checked property.
    autoStartToggle.checked =
      localStorage.getItem("autoStartEnabled") === "true";
  }

  /**
   * Handles the form submission to save all the current settings.
   * @param {Event} event - The form submission event.
   */
  function saveSettings(event) {
    // Prevent the browser from reloading the page on form submission.
    event.preventDefault();

    // Save the duration values.
    localStorage.setItem("pomodoroDuration", pomodoroInput.value);
    localStorage.setItem("shortBreakDuration", shortBreakInput.value);
    localStorage.setItem("longBreakDuration", longBreakInput.value);

    // *** FIX: Correctly save the state of the toggle switch. ***
    // The .checked property is a boolean (true/false), which localStorage
    // will automatically convert to a string ('true'/'false').
    localStorage.setItem("autoStartEnabled", autoStartToggle.checked);

    // Show a confirmation message to the user.
    saveConfirmation.textContent = "Settings Saved!";
    saveConfirmation.classList.add("show");

    // Hide the message after 3 seconds.
    setTimeout(() => {
      saveConfirmation.classList.remove("show");
    }, 3000);
  }

  // =========================================================================
  //   EVENT LISTENERS & INITIALIZATION
  // =========================================================================

  // Listen for the form's 'submit' event.
  settingsForm.addEventListener("submit", saveSettings);

  // Load existing settings as soon as the page is ready.
  loadSettings();
});
