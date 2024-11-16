// API URL
const apiURL = "https://opentdb.com/api.php?amount=10&category=21&difficulty=medium&type=multiple";

// Variables
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

// DOM Elements
const landingPage = document.getElementById("landing-page");
const quizInterface = document.getElementById("quiz-interface");
const scoreboard = document.getElementById("scoreboard");
const questionNumberEl = document.getElementById("question-number");
const questionTextEl = document.getElementById("question-text");
const optionsContainer = document.getElementById("options");
const timerEl = document.getElementById("time-left");
const currentScoreEl = document.getElementById("current-score");
const finalScoreEl = document.getElementById("final-score");

// Start Quiz
document.getElementById("start-btn").addEventListener("click", startQuiz);

function startQuiz() {
  const startButton = document.getElementById("start-btn");
  startButton.disabled = true; // Disable the button after the first click
  landingPage.classList.add("hidden");
  quizInterface.classList.remove("hidden");
  fetchQuestions();
}


// Fetch Questions from API
async function fetchQuestions() {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    questions = data.results;
    showQuestion();
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

// Display Question
function showQuestion() {
  if (currentQuestionIndex < questions.length) {
    const questionObj = questions[currentQuestionIndex];
    questionNumberEl.textContent = `Question ${currentQuestionIndex + 1}`;
    questionTextEl.textContent = decodeURIComponent(questionObj.question);

    const options = [...questionObj.incorrect_answers, questionObj.correct_answer];
    options.sort(() => Math.random() - 0.5); // Shuffle options

    optionsContainer.innerHTML = ""; // Clear previous options
    options.forEach(option => {
      const button = document.createElement("button");
      button.textContent = decodeURIComponent(option);
      button.addEventListener("click", () => validateAnswer(option, questionObj.correct_answer));
      optionsContainer.appendChild(button);
    });

    resetTimer();
    startTimer();
  } else {
    showScoreboard();
  }
}

// Validate Answer
function validateAnswer(selected, correct) {
  if (selected === correct) {
    score += 10; // Increment score
    currentScoreEl.textContent = score;
  }
  currentQuestionIndex++;
  showQuestion();
}

// Reset Timer
function resetTimer() {
  clearInterval(timer);
  timeLeft = 15;
  timerEl.textContent = timeLeft;
}

// Start Timer
function startTimer() {
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timerEl.textContent = timeLeft;
    } else {
      clearInterval(timer);
      currentQuestionIndex++;
      showQuestion();
    }
  }, 1000);
}

// Show Scoreboard
function showScoreboard() {
  quizInterface.classList.add("hidden");
  scoreboard.classList.remove("hidden");
  finalScoreEl.textContent = score;
}

// Restart Quiz
document.getElementById("restart-btn").addEventListener("click", () => location.reload());

// Share Score
document.getElementById("share-btn").addEventListener("click", () => {
  const shareText = `I scored ${score} in the Sports Quiz! Can you beat me?`;
  if (navigator.share) {
    navigator.share({ text: shareText }).catch(console.error);
  } else {
    alert(shareText);
  }
});

