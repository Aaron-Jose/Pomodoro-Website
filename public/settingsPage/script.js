document.addEventListener("DOMContentLoaded", function () {
  const storedData = localStorage.getItem("userSettings");

    if (storedData) {
        const parsedData = JSON.parse(storedData)
        document.getElementById("pomodoro").value = parsedData['pomodoro']
        document.getElementById("shortBreak").value = parsedData['shortBreak']
        document.getElementById("longBreak").value = parsedData['longBreak']

        document.getElementById("longBreakInterval").value = parsedData['longBreakInterval']
        document.getElementById("24hr").checked = parsedData['twentyfourhr']

    } 

    console.log(document.getElementById("24hr").checked);
  
});

function saveFunction() {
  
  const settings = {
    pomodoro: document.getElementById("pomodoro").value
    ? document.getElementById("pomodoro").value
    : 50,
    shortBreak: document.getElementById("shortBreak").value
    ? document.getElementById("shortBreak").value
    : 10,
    longBreak: document.getElementById("longBreak").value
    ? document.getElementById("longBreak").value
    : 20,
    longBreakInterval: document.getElementById("longBreakInterval").value
    ? document.getElementById("longBreakInterval").value
    : 4,

    twentyfourhr: document.getElementById("24hr").checked,
  };

  const jsonString = JSON.stringify(settings);

  localStorage.setItem("userSettings", jsonString);

  console.log("Data saved to localStorage:", jsonString);
}
