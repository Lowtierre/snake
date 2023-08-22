const playboard = document.querySelector(".playboard");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".control");

// game variables

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
highScore = localStorage.getItem("high-score");
let frames;

// control if device is touch or not

function is_touch_enabled() {
    return ( 'ontouchstart' in window ) ||
           ( navigator.maxTouchPoints > 1 ) ||
           ( navigator.msMaxTouchPoints > 1 );
}

if (is_touch_enabled()) {
    frames = 150;
    console.log("touch")
} else {
    frames = 100;
    console.log("mouse")
}

// update position of food 

const updateFoodPos = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// handle end of the game

const handleGameOver = () => {
    gameOver = true;
    alert("You're a loser!!");
    clearInterval(setIntervalId);
    location.reload()
}

// change direction of snake based on key

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

    // create div for the food

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`

    // control if snake eat the food

    if (snakeX == foodX && snakeY == foodY) {
        updateFoodPos();
        snakeBody.push([foodX, foodY]);
        score++;
        highScore = score >= highScore ? score : highScore;
    }

    // update scoreElement and highScoreElement

    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;

    // change directions of snake's head

    snakeX += velocityX;
    snakeY += velocityY;

    // update snake's body

    snakeBody.pop();
    snakeBody.unshift([snakeX, snakeY]);

    // control if snake gets out from grid 
    
    if (snakeX < 1 || snakeX > 30 || snakeY < 1 || snakeY > 30) {
        handleGameOver()
    }
    
    // control if snake hits its own body 

    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            handleGameOver()
        }
    }

    // create divs for snake's body

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`
    }

    // display

    playboard.innerHTML = html;
}

// initialize

updateFoodPos()
setIntervalId = setInterval(initGame, frames);

// change directions based on keyboard events 

document.addEventListener("keyup", e => changeDirection(e.key));

// change directions based on click or touch events 

controls.forEach(button => {
    button.addEventListener("click", () => changeDirection(button.dataset.key));
    button.addEventListener("touchend", () => changeDirection(button.dataset.key));
})