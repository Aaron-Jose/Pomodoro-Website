document.addEventListener('DOMContentLoaded', () => {

    // DOM Element Caching
    const todayCountEl = document.getElementById('today-count');
    const totalCountEl = document.getElementById('total-count');
    const totalHoursEl = document.getElementById('total-hours');
    const resetBtn = document.getElementById('reset-stats-btn');

    /**
     * Reads stats from localStorage and updates the display.
     */
    function displayStats() {
        const stats = JSON.parse(localStorage.getItem('pomodoroStats')) || { total: 0, daily: {} };
        const today = new Date().toISOString().split('T')[0];

        const todayCount = stats.daily[today] || 0;
        const totalCount = stats.total || 0;

        // Get the user-defined pomodoro duration to calculate hours, default to 25
        const pomodoroDuration = parseInt(localStorage.getItem('pomodoroDuration')) || 25;
        const totalMinutes = totalCount * pomodoroDuration;
        const totalHours = (totalMinutes / 60).toFixed(1);

        // Update the text content of the elements
        todayCountEl.textContent = todayCount;
        totalCountEl.textContent = totalCount;
        totalHoursEl.textContent = totalHours;
    }

    /**
     * Resets all stored statistics after confirmation.
     */
    function resetStats() {
        // Use a custom modal in a real app, but confirm is okay for this example
        const isConfirmed = confirm('Are you sure you want to reset all your statistics? This action cannot be undone.');
        
        if (isConfirmed) {
            localStorage.removeItem('pomodoroStats');
            // Refresh the display to show the reset values (zeros)
            displayStats();
        }
    }

    // Add event listener for the reset button
    resetBtn.addEventListener('click', resetStats);

    // Initial call to display stats when the page loads
    displayStats();
});
