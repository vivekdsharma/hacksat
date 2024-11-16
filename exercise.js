let timer;
let timeLeft = 30; // Set initial timer to 30 seconds
let currentSet = 1;
let totalSets = 3;
const feedbackMessages = ["Keep it up!", "You're doing great!", "Almost there!"];
const motivationalQuotes = ["Great job!", "You smashed it!", "Keep going strong!"];
let currentExercise = "";

// API configuration
const apiKey = '6259b443b1msh024951540eec929p14deddjsn3ef3be86880c';
const apiUrl = 'https://exercisedb.p.rapidapi.com/exercises';
const headers = {
  "x-rapidapi-host": "exercisedb.p.rapidapi.com",
  "x-rapidapi-key": apiKey
};

async function fetchAndDisplayExercises() {
  try {
    const response = await fetch(apiUrl, { method: 'GET', headers: headers });
    const exercises = await response.json();
    populateDropdown(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
  }
}

function populateDropdown(exercises) {
  const dropdown = document.getElementById('exercise-dropdown');
  exercises.forEach(exercise => {
    const option = document.createElement('option');
    option.value = exercise.name;
    option.textContent = exercise.name;
    option.dataset.gif = exercise.gifUrl;
    dropdown.appendChild(option);
  });

  dropdown.addEventListener('change', (e) => displaySelectedExercise(e.target));
}

function displaySelectedExercise(dropdown) {
  const selectedOption = dropdown.options[dropdown.selectedIndex];
  currentExercise = selectedOption.value;
  const gifUrl = selectedOption.dataset.gif;

  // Reset the timer to 30 seconds for the selected exercise
  timeLeft = 30;
  currentSet = 1;

  // Update exercise details
  document.getElementById('exercise-name').textContent = currentExercise;
  document.getElementById('exercise-animation').innerHTML = `<img src="${gifUrl}" alt="${currentExercise}">`;
  document.getElementById('timer').textContent = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;
  document.getElementById('current-set').textContent = currentSet;

  // Show necessary sections
  document.getElementById('exercise-display').classList.remove('hidden');
  document.getElementById('controls').classList.remove('hidden');
  document.getElementById('timer-tracker').classList.add('hidden');
}

function startWorkout() {
  document.getElementById('timer-tracker').classList.remove('hidden');
  document.getElementById('start-button').disabled = true;
  timer = setInterval(updateTimer, 1000);
  document.getElementById("feedback-text").textContent = "Let's go!";
}

function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    document.getElementById("timer").textContent = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;
  } else {
    stopWorkout();
    if (currentSet < totalSets) {
      currentSet++;
      timeLeft = 30; // Reset to 30 seconds for the next set
      document.getElementById("current-set").textContent = currentSet;
      showFeedback();
    } else {
      showMotivationalQuote();
    }
  }
}

function stopWorkout() {
  clearInterval(timer);
  document.getElementById("feedback-text").textContent = "Set completed!";
  document.getElementById('start-button').disabled = false;
}

function resetWorkout() {
  clearInterval(timer);
  timeLeft = 30; // Reset to 30 seconds
  currentSet = 1;
  document.getElementById("timer").textContent = `00:${timeLeft}`;
  document.getElementById("current-set").textContent = "1";
  document.getElementById("feedback-text").textContent = "Ready?";
  document.getElementById("motivational-quote").textContent = "";
  document.getElementById('start-button').disabled = false;
}

function showFeedback() {
  const randomIndex = Math.floor(Math.random() * feedbackMessages.length);
  document.getElementById("feedback-text").textContent = feedbackMessages[randomIndex];
}

function showMotivationalQuote() {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  document.getElementById("motivational-quote").textContent = motivationalQuotes[randomIndex];
}

fetchAndDisplayExercises();
