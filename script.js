document.addEventListener("DOMContentLoaded", function () {
  // Constants
  const gameDisplay = document.querySelector(".game-container");
  const gameScreen = document.querySelector(".game-screen");
  const plane = document.querySelector(".plane");
  const explosion = document.querySelector(".explosion");
  const scoreCounter = document.querySelector(".score-container span");
  const scoreBoard = document.querySelector(".score-board");

  // Audio Setup
  const hitSound = new Audio("audios/hit.ogg");
  const jumpSound = new Audio("audios/jump.ogg");
  const scoreSound = new Audio("audios/score.ogg");
  const bgSound = new Audio("audios/nasheed.ogg");

  // Setup
  addListner();
  bgSound.play();
  plane.style.width = window.innerWidth > 400 ? "150px" : "100px";

  // Variables
  let planeBottom = 400;

  let isGameOver = false;
  let gravity = 4;
  let angle = 0;
  let gap = window.innerWidth > 350 ? 180 : 100;

  let score = 0;
  let gameTimerId = setInterval(startGame, 20);

  // Functions
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function jump() {
    if (planeBottom < 480) planeBottom += 60;

    jumpSound.play();

    angle = -getRandomNumber(20, 30);

    plane.style.transform = `rotate(${angle}deg)`;
    plane.style.bottom = planeBottom + "px";
  }

  function control(e) {
    if (e.keyCode === 32 || e.keyCode === 38) {
      jump();
    }
  }

  function startGame() {
    if (planeBottom < 20) {
      clearInterval(gameTimerId);
    }

    angle = angle > 50 ? 50 : angle + getRandomNumber(2, 4);
    planeBottom -= gravity;

    plane.style.transform = `rotate(${angle}deg)`;
    plane.style.bottom = planeBottom + "px";
  }

  function updateScore() {
    if (isGameOver) return;
    score += 1;
    scoreSound.play();
    scoreCounter.innerHTML = score;
  }

  function setHighScore(score) {
    localStorage.setItem("highScore", score);
  }


  function gameOver(left, top) {
    explosion.style.left = left + "px";
    explosion.style.top = top + "px";
    explosion.style.display = "block";

    gameDisplay.classList.add("animation-stop");
    scoreBoard.classList.add("show")

    bgSound.pause();

    let currentScore = score;
    let highScore = localStorage.getItem("highScore");

    if (highScore === null || currentScore > highScore) {
      setHighScore(currentScore);
      highScore = currentScore;
    }

    let [curSpan, highSpan] = scoreBoard.querySelectorAll("span");
    curSpan.innerHTML = currentScore;
    highSpan.innerHTML = highScore;

    isGameOver = true;
    removeListner();
  }

  function generateObstacle() {
    let obstacle = document.createElement("div");
    let topObstacle = document.createElement("div");

    let randomHeight = getRandomNumber(40, 230);
    let obstacleLeft = gameScreen.clientWidth;

    obstacle.classList.add("bottom", "obstacle");
    topObstacle.classList.add("top", "obstacle");

    obstacle.style.left = obstacleLeft + "px";
    topObstacle.style.left = obstacleLeft + "px";

    obstacle.style.height = randomHeight + "px";
    topObstacle.style.height =
      gameScreen.clientHeight - randomHeight - gap + "px";

    gameScreen.appendChild(obstacle);
    gameScreen.appendChild(topObstacle);

    function moveObstacle() {
      if (isGameOver) return;
      obstacleLeft -= 4;
      obstacle.style.left = obstacleLeft + "px";
      topObstacle.style.left = obstacleLeft + "px";

      if (obstacleLeft < -10) {
        clearInterval(obstacleTimerId);
        gameScreen.removeChild(obstacle);
        gameScreen.removeChild(topObstacle);
        updateScore();
      }

      let obstacles = document.querySelectorAll(".obstacle");

      obstacles.forEach((elem) => {
        let planeProps = plane.getBoundingClientRect();
        let elemProps = elem.getBoundingClientRect();

        if (
          planeProps.left < elemProps.left + elemProps.width &&
          planeProps.left + planeProps.width > elemProps.left &&
          planeProps.top < elemProps.top + elemProps.height &&
          planeProps.top + planeProps.height > elemProps.top
        ) {
          clearInterval(obstacleTimerId);
          hitSound.play();
          gameOver(elemProps.left - 50, planeProps.top - 30);
        }
        if (planeBottom < 13) {
          clearInterval(obstacleTimerId);
          hitSound.play();
          gameOver(planeProps.left, planeProps.top + 30);
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
});
