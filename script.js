// Constants
const plane = document.querySelector(".plane");
const gameDisplay = document.querySelector(".game-container");
const ground = document.querySelector(".ground");
const ceiling = document.querySelector(".ceiling");
const sky = document.querySelector(".sky");
const land = document.querySelector(".land");
const explode = document.querySelector(".explode");
const scoreCounter = document.querySelector(".score-counter");

// Audio Setup
const hitSound = new Audio("audios/hit.ogg");
const jumpSound = new Audio("audios/jump.ogg");
const scoreSound = new Audio("audios/score.ogg");

// Setup
addListner();

plane.style.width = window.width > 400 ? "150px" : "100px";
plane.style.height = window.width > 400 ? "40px" : "30px";

// Variables
let planeLeft = gameDisplay.clientWidth / 8;
let planeBottom = 400;

let isGameOver = false;
let gravity = 3;
let gap = 420;
let angle = 0;

let score = 0;
let gameTimerId = setInterval(startGame, 20);
let scoreInterval = setInterval(updateScore, 2600);

// Functions
function jump() {
  if (planeBottom < 520) planeBottom += 50;

  jumpSound.play();
  plane.style.bottom = planeBottom + "px";
}

function control(e) {
  if (e.keyCode === 32 || e.keyCode === 38) {
    jump();
  }
}

function startGame() {
  if (planeBottom < 90) {
    clearInterval(gameTimerId);
  }
  planeBottom -= gravity;

  plane.style.bottom = planeBottom + "px";
  plane.style.left = planeLeft + "px";
}

function updateScore() {
  if (isGameOver) return;
  score += 1;
  scoreSound.play();
  scoreCounter.innerHTML = score;
}

function gameOver(left, top) {
  hitSound.play();

  explode.style.display = "block";
  explode.style.position = "fixed";
  explode.style.left = left + "px";
  explode.style.top = top + "px";

  clearInterval(scoreInterval);

  isGameOver = true;

  ceiling.classList.add("stop-animation");
  land.classList.add("stop-animation");
  sky.classList.add("stop-animation");

  removeListner();
}

function generateObstacle() {
  let obstacle = document.createElement("div");
  let topObstacle = document.createElement("div");

  let randomHeight = Math.random() * 90;
  let obstacleLeft = gameDisplay.clientWidth;
  let obstacleBottom = randomHeight;

  obstacle.classList.add("obstacle");
  topObstacle.classList.add("topObstacle", "obstacle");

  obstacle.style.left = obstacleLeft + "px";
  topObstacle.style.left = obstacleLeft + "px";

  obstacle.style.bottom = obstacleBottom + "px";
  topObstacle.style.bottom = obstacleBottom + gap + "px";

  gameDisplay.appendChild(obstacle);
  gameDisplay.appendChild(topObstacle);

  function moveObstacle() {
    if (isGameOver) return;
    obstacleLeft -= 4;
    obstacle.style.left = obstacleLeft + "px";
    topObstacle.style.left = obstacleLeft + "px";

    if (obstacleLeft < -70) {
      clearInterval(obstacleTimerId);
      gameDisplay.removeChild(obstacle);
      gameDisplay.removeChild(topObstacle);
    }

    let obstacles = document.querySelectorAll(".obstacle");

    obstacles.forEach((elem) => {
      let planeProps = plane.getBoundingClientRect();
      let elemProps = elem.getBoundingClientRect();

      if (
        (planeProps.left < elemProps.left + elemProps.width &&
          planeProps.left + planeProps.width > elemProps.left &&
          planeProps.top < elemProps.top + elemProps.height &&
          planeProps.top + planeProps.height > elemProps.top) ||
        planeBottom < 90
      ) {
        clearInterval(obstacleTimerId);
        gameOver(planeProps.left, planeProps.top);
      }
    });
  }
  let obstacleTimerId = setInterval(moveObstacle, 20);
  if (!isGameOver) setTimeout(generateObstacle, 2500);
}
generateObstacle();

// Event Listeners
function addListner() {
  document.addEventListener("keydown", control);
  document.addEventListener("mousedown", jump);
}

function removeListner() {
  document.removeEventListener("keydown", control);
  document.removeEventListener("mousedown", jump);
}
