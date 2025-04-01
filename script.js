const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = { x: 100, y: 100 };
let gameSpeed = 100;
let score = 0;
let gameOverFlag = false;  // Flag to indicate if the game is over

// Adjust the canvas size to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (gameOverFlag) return;  // Prevent direction change if game is over

    const key = event.key;
    if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function update() {
    if (gameOverFlag) return;  // Stop updating if the game is over

    let head = { ...snake[0] };
    if (direction === "UP") head.y -= 20;
    if (direction === "DOWN") head.y += 20;
    if (direction === "LEFT") head.x -= 20;
    if (direction === "RIGHT") head.x += 20;

    // Wrap snake around screen edges
    if (head.x < 0) head.x = canvas.width - 20;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - 20;
    if (head.y >= canvas.height) head.y = 0;

    // Check if snake runs into itself (excluding the head)
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver();
            return;
        }
    }

    // Add the new head to the snake
    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        food = {
            x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
            y: Math.floor(Math.random() * (canvas.height / 20)) * 20
        };
        score++;
        increaseSpeed(); // Speed up as snake grows
    } else {
        snake.pop(); // Remove last segment if no food eaten
    }
}

function increaseSpeed() {
    if (gameSpeed > 50) {
        gameSpeed -= 2; // Speed up the game by decreasing the delay
    }
}

function draw() {
    // Draw background image only once
    const img = new Image();
    img.src = 'gamebackground.jpg';  // Ensure the path is correct
    img.onload = () => {
        // Once the image is loaded, draw it on the canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Now draw the snake, food, and score after the background
        drawGameElements();  // Call the separate function to draw the game elements
    };
}

function drawGameElements() {
    // Draw snake
    ctx.fillStyle = "lime";
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 20, 20));

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);

    // Draw score
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

function gameOver() {
    gameOverFlag = true;  // Set the game over flag

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 150, canvas.height / 2);
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, canvas.width / 2 - 50, canvas.height / 2 + 50);

    // Clear the game loop timeout to stop the game
    clearTimeout(gameLoopTimeout);
}

let gameLoopTimeout;

function gameLoop() {
    update();
    draw();
    if (!gameOverFlag) {
        gameLoopTimeout = setTimeout(gameLoop, gameSpeed);
    }
}

window.onload = function() {
    console.log("Game started!");
    gameLoop();
};

// Resize canvas if the window size changes
window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

