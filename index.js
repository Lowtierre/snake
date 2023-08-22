const playboard = document.querySelector(".playboard");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".control");

const dim = 30;

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

let highScore = localStorage.getItem("high-score");

const updateFoodPos = () => {
    foodX = Math.floor(Math.random() * dim) + 1;
    foodY = Math.floor(Math.random() * dim) + 1;
}

const handleGameOver = () => {
    gameOver = true;
    alert("You're a loser!!");
    clearInterval(setIntervalId);
    location.reload()
}

const changeDirection = key => {
    if (key == "ArrowUp" && velocityY != 1) {
        velocityY = -1;
        velocityX = 0;
        console.log(key)
    }
    if (key == "ArrowDown" && velocityY != -1) {
        velocityY = 1;
        velocityX = 0;
        console.log(key)
    }
    if (key == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
        console.log(key)
    }
    if (key == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
        console.log(key)
    }
}

const initGame = () => {

    gameOver = false;
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`

    if (snakeX == foodX && snakeY == foodY) {
        updateFoodPos();
        snakeBody.push([foodX, foodY]);
        score++;
        highScore = score >= highScore ? score : highScore;
    }

    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;

    snakeX += velocityX;
    snakeY += velocityY;

    snakeBody.pop();
    snakeBody.unshift([snakeX, snakeY]);

    if (snakeX < 1 || snakeX > dim || snakeY < 1 || snakeY > dim) {
        handleGameOver()
    }

    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            handleGameOver()
        }
    }

    console.log(snakeBody)

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`
    }
    playboard.innerHTML = html;
}

updateFoodPos()
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", e => changeDirection(e.key));

controls.forEach(button => {
    button.addEventListener("click", () => changeDirection(button.dataset.key));
    button.addEventListener("touchup", () => changeDirection(button.dataset.key));
})