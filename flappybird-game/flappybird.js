// Initialize the grid canvas and its dimensions
let grid;
let gridWidth = 360;
let gridHeight = 640;
let ctx;

// Initialize the bird's properties
let birdWidth = 34; 
let birdHeight = 24;
let birdX = gridWidth / 8;
let birdY = gridHeight / 2;

// Create an object to represent the bird
let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

// Initialize pipe properties and an array to hold pipes
let pipeArr = [];
let pipeWidth = 64; 
let pipeHeight = 512;
let pipeX = gridWidth;
let pipeY = 0;

// Initialize variables for physics and game state
let birdImg;
let flappyBirdPipeTop;
let flappyBirdPipeBottom;
let vx = -2;
let vy = 0; 
let grav = 0.4;
let gameOver = false;
let gameStarted = false; 
let score = 0;
let lastFrameTime = 0;
const fixedTimeStep = 1000 / 60; // 60 fps cap

// Setup the game when the window loads
window.onload = function() {
    grid = document.getElementById("grid");
    ctx = grid.getContext("2d"); 
    grid.height = gridHeight;
    grid.width = gridWidth;

    // Load bird image and display it
    birdImg = new Image();
    birdImg.src = "/flappybird-pictures/flappybird.png";
    birdImg.onload = function() {
        ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    // Load images for the pipes
    flappyBirdPipeTop = new Image();
    flappyBirdPipeTop.src = "/flappybird-pictures/flappybird-top.png";
    flappyBirdPipeBottom = new Image();
    flappyBirdPipeBottom.src = "/flappybird-pictures/flappybird-bottom.png";

    // Display initial instructions
    ctx.fillStyle = "white";
    ctx.font="30px sans-serif";
    ctx.fillText("PRESS TO START", 53, gridHeight / 2);

    // Add event listeners for starting the game
    document.addEventListener("keydown", startGame);
    grid.addEventListener("click", startGame);
}

// Function to start the game when triggered
function startGame() {
    if(!gameStarted) {
        gameStarted = true;
        requestAnimationFrame(gameLoop);
        setInterval(spawnPipes, 1500); 
        document.removeEventListener("keydown", startGame);
        document.addEventListener("keydown", moveBird);
    }
} // end startGame()

// Main game loop function for managing frame updates
function gameLoop(timestamp) {
    requestAnimationFrame(gameLoop);

    const elapsed = timestamp - lastFrameTime;

    if (elapsed > fixedTimeStep) {
        lastFrameTime = timestamp - (elapsed % fixedTimeStep);
        update(); // Update game state
    }
} // end gameLoop()

// Update function to manage game logic
function update() {
    if(gameOver) {
        return;
    }

    // Clear the canvas
    ctx.clearRect(0, 0, grid.width, grid.height);

    // Update bird physics and position
    vy += grav;
    bird.y = Math.max(bird.y + vy, 0);
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > grid.height) {
        gameOver = true;
    }

    // Update pipes and handle scoring
    for (let i = 0; i < pipeArr.length; i++) {
        let pipe = pipeArr[i];
        pipe.x += vx;
        ctx.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x) {
            score += 0.5; // 0.5 points for top and bottom pipe
            pipe.passed = true;
        }

        // Check for collisions
        if(collisionDetection(bird, pipe)) {
            gameOver = true;
        }
    }

    // Remove off-screen pipes
    while (pipeArr.length > 0 && pipeArr[0].x < -pipeWidth) {
        pipeArr.shift();
    }

    // Display score
    ctx.fillStyle = "white";
    ctx.font="45px sans-serif";
    ctx.fillText(score, 170, 45);

    // Display "Game Over" if the game ends
    if(gameOver) {
        ctx.fillText("GAME OVER", 43, gridHeight / 2);
        ctx.font = "20px sans-serif";
        ctx.fillText("PRESS TO START", 98, gridHeight / 2 + 40);
    }
}

// Function to spawn pipes at random intervals
function spawnPipes() {
    if(gameOver) {
        return;
    }

    // Calculate random position and gap for the pipes
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let gap = grid.height / 5;

    // Create the top pipe
    let topPipe = {
        img : flappyBirdPipeTop,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArr.push(topPipe);

    // Create the bottom pipe
    let bottomPipe = {
        img : flappyBirdPipeBottom,
        x : pipeX,
        y : randomPipeY + pipeHeight + gap,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArr.push(bottomPipe);
}

// Function to handle bird movement based on user input
function moveBird(e) {
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyW") {
        vy = -6;

        if(gameOver) {
            resetGame(); // Reset game if it's over
        }
    }
}

// Add click listener to move the bird
document.addEventListener("click", function(e) {
    moveBird({ code: "Space" }); 
});

// Add touch listener to move the bird on touch devices
document.addEventListener("touchstart", function(e) {
    moveBird({ code: "Space" }); 
});

// Function for collision detection between two objects
function collisionDetection(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;    
}

// Function to reset the game to its initial state
function resetGame() {
    bird.y = birdY;
    pipeArr = [];
    score = 0;
    gameOver = false;
}
