const gameBoard = document.getElementById('gameBoard');
const ctx = gameBoard.getContext('2d');
const scoreText = document.getElementById('scoreText');
const resetBtn = document.getElementById('resetBtn');

// Game settings
let gameWidth = gameBoard.width;
let gameHeight = gameBoard.height;

let playerLeftScore = 0;
let playerRightScore = 0;

// Paddle settings
let paddleHeight = 80;
let paddleWidth = 10;
let paddleSpeed = 4.0;
let paddleColor = "white";

let botSpeed = 0.6;

let leftPaddle = {
    x: 10.0,
    y: gameHeight/2.0,
};

let rightPaddle = {
    x: gameWidth - 20.0,
    y: gameHeight/2.0,
};

// Ball settings
let ball = {
    radius: 5.0,
    speed: 3.0,
    x: gameWidth/2.0,
    y: gameHeight/2.0,
    xDir: 0.0,
    yDir: 0.0
};

// Wait for duration in milliseconds
function wait(timer, duration) {
    while ((new Date()).getTime() - timer <= duration) { 
        // pause
    };
}

// Update score
function updateScore() {
    scoreText.textContent = `${playerLeftScore} : ${playerRightScore}`;
}

// Clear the game board
function clearBoard(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

// Draw the paddles
function drawPaddles() {
    ctx.fillStyle = paddleColor;
    ctx.fillRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight);    // Left paddle
    ctx.fillRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight);    // Right paddle
}

// Initialize ball at the center of the game with randomized velocity
function startBall() {
    // Center the ball
    ball.x = gameWidth/2.0;
    ball.y = gameHeight/2.0;

    // Setting random ball direction
    if(Math.round(Math.random()) == 1)
        ball.xDir =  1; 
    else
        ball.xDir = -1; 

    if(Math.round(Math.random()) == 1)
        ball.yDir = 1;   
    else   
        ball.yDir = -1;


    
    drawBall();
}

// Draw the ball
function drawBall() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

// Move the ball
function moveBall(){
    ball.x += (ball.speed * ball.xDir);
    ball.y += (ball.speed * ball.yDir);
}


// Check for ball collision against the edges or paddles
function checkCollision() {
    // Collisions against the top and bottom
    if(ball.y <= ball.radius)
        ball.yDir *= -1;
    if(ball.y >= gameHeight - ball.radius)
        ball.yDir *= -1;

    // Right player scores a point i.e ball hit the left edge
    if(ball.x <= 0){
        playerRightScore += 1;
        updateScore();
        ball.speed += 0.1;
        botSpeed += 0.1;
        wait((new Date()).getTime(), 1000);
        startBall();
        return;
    }

    // Left player scores a point i.e ball hit the right edge
    if(ball.x >= gameWidth){
        playerLeftScore += 1;
        updateScore();
        ball.speed += 0.1;
        botSpeed += 0.1;
        wait((new Date()).getTime(), 1000);
        startBall();
        return;
    }

    // Collisions against left paddle
    if(ball.x <= (leftPaddle.x + paddleWidth + ball.radius)){
        if(ball.y > leftPaddle.y && ball.y < leftPaddle.y + paddleHeight){
            ball.x = (leftPaddle.x + paddleWidth) + ball.radius; 
            ball.xDir *= -1;
        }
    }

    // Collisions against right paddle
    if(ball.x >= (rightPaddle.x - ball.radius)){
        if(ball.y > rightPaddle.y && ball.y < rightPaddle.y + paddleHeight){
            ball.x = rightPaddle.x - ball.radius; 
            ball.xDir *= -1;
        }
    }

}


// Set key states for paddle movement
const keyStates = {
    arrowUp: false,
    arrowDown: false,
};

// Listen for key down and key up events to track key states
window.addEventListener("keydown", (event) => {
    if (event.key === 'ArrowUp') {
        keyStates.arrowUp = true;
    } else if (event.key === 'ArrowDown') {
        keyStates.arrowDown = true;
    }
});

window.addEventListener("keyup", (event) => {
    if (event.key == 'ArrowUp' || event.key == 'ArrowDown') {
        keyStates.arrowUp = false;
        keyStates.arrowDown = false;
    }
});

// Move paddle based on key state
function movePaddle() {
    if (keyStates.arrowUp) {
        if (leftPaddle.y > 0) {
            leftPaddle.y -= paddleSpeed;
        }
    }
    else if (keyStates.arrowDown) {
        if (leftPaddle.y < gameHeight - paddleHeight) {
            leftPaddle.y += paddleSpeed;
        }
    }
}

function moveBot() {
    if (ball.y <= rightPaddle.y) {
        if (rightPaddle.y > 0) {
            rightPaddle.y -= botSpeed;
        }
    } 
    else if (ball.y >= rightPaddle.y + paddleHeight) {
        if (rightPaddle.y < gameHeight - paddleHeight) {
            rightPaddle.y += botSpeed;
        }
    }
}

// Reset game
resetBtn.addEventListener('click', function () {
    window.location.reload();
});

window.onload = function() {
    clearBoard();
    drawPaddles();
    startBall();
};

function update() {
    clearBoard();
    drawPaddles();
    movePaddle();
    moveBall();
    moveBot();
    drawBall();
    checkCollision();
    requestAnimationFrame(update);
}

update();
