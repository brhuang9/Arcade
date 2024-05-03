// Initialize the grid canvas and its dimensions
let grid;
let gridWidth = 360;
let gridHeight = 576;
let ctx;

// Initialize the doodle's properties
let doodleWidth = 46;
let doodleHeight = 46;
let doodleX = gridWidth / 2 - doodleWidth / 2;
let doodleY = gridHeight * 7 / 8 - doodleHeight;
let doodleRight;
let doodleLeft;

// Create an object to represent the doodle
let doodle = {
    img : null,
    x : doodleX,
    y : doodleY,
    width : doodleWidth,
    height : doodleHeight
}

// Initialize physics variables
let vx = 0; 
let vy = 0; 
let initvy = -12; 
let grav = 0.35;

// Initialize platform properties
let platformArr = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

// Initialize game state variables
let score = 0;
let maxScore = 0;
let gameOver = false;
let gameStarted = false;
let lastFrameTime = 0;
const fixedTimeStep = 1000 / 60; // 60 fps cap

// Setup the game when the window loads
window.onload = function() {
    grid = document.getElementById("grid");
    grid.height = gridHeight;
    grid.width = gridWidth;
    ctx = grid.getContext("2d");

    // Load images for the doodle and platforms
    doodleRight = new Image();
    doodleRight.src = "../doodlejump-pictures/doodle-right.png";
    doodle.img = doodleRight;
    doodleRight.onload = function() {
        ctx.drawImage(doodle.img, doodle.x, doodle.y, doodle.width, doodle.height);
    }

    doodleLeft = new Image();
    doodleLeft.src = "../doodlejump-pictures/doodle-left.png";
    platformImg = new Image();
    platformImg.src = "../doodlejump-pictures/platform.png";

    // Display initial instructions
    ctx.fillStyle = "black";
    ctx.font="30px sans-serif";
    ctx.fillText("PRESS TO START", 53, gridHeight / 2);
    vy = initvy;
    spawnPlatforms(); // Initialize platforms
    document.addEventListener("keydown", checkStartGame);
    grid.addEventListener("click", startGame);
    grid.addEventListener("touchstart", startGame);
}

// Function to check and start the game when triggered by key press
function checkStartGame(e) {
    if (e.code === "Space" && !gameStarted) {
        startGame();
        document.removeEventListener("keydown", checkStartGame);
        document.addEventListener("keydown", moveDoodle);
    }
}

// Main game loop function for managing frame updates
function gameLoop(timestamp) {
    requestAnimationFrame(gameLoop);
    const elapsed = timestamp - lastFrameTime;

    // Update at a fixed time step
    if (elapsed > fixedTimeStep) {
        lastFrameTime = timestamp - (elapsed % fixedTimeStep);
        update(); // Update game state
    }
}

// Function to start the game when triggered
function startGame(event) {
    if (!gameStarted) {
        gameStarted = true;
        requestAnimationFrame(gameLoop);
        document.removeEventListener("keydown", checkStartGame);
        grid.removeEventListener("click", startGame);
        grid.removeEventListener("touchstart", startGame);
        document.addEventListener("keydown", moveDoodle);
    }
}

// Update function to manage game logic
function update() {
    if (gameOver) {
        return;
    }

    // Clear the canvas
    ctx.clearRect(0, 0, grid.width, grid.height);

    // Update doodle horizontal movement
    doodle.x += vx;
    if (doodle.x > gridWidth) {
        doodle.x = 0;
    } else if (doodle.x + doodle.width < 0) {
        doodle.x = gridWidth;
    }

    // Update doodle vertical movement
    vy += grav;
    doodle.y += vy;

    // Handle vertical scrolling
    if (doodle.y < gridHeight / 4) {
        let dy = gridHeight / 4 - doodle.y;
        doodle.y += dy;
        platformArr.forEach(platform => {
            platform.y += dy;
        });
    }

    // Check for game over condition
    if (doodle.y > grid.height) {
        gameOver = true;
    }

    // Draw the doodle
    ctx.drawImage(doodle.img, doodle.x, doodle.y, doodle.width, doodle.height);

    // Platforms and collision detection
    for (let i = 0; i < platformArr.length; i++) {
        let platform = platformArr[i];

        // Check for collision with platforms when falling
        if (vy >= 0 && detectCollision(doodle, platform)) {
            vy = initvy; // Reset vertical velocity to jump
        }

        ctx.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // Clean up off-screen platforms and spawn new ones
    while (platformArr.length > 0 && platformArr[0].y >= gridHeight) {
        platformArr.shift();
        newPlatform();
    }

    updateScore(); // Update the score
    ctx.fillStyle = "black";
    ctx.font = "16px sans-serif";
    ctx.fillText(score, 5, 20);

    // Display "Game Over" if the game ends
    if (gameOver) {
        ctx.fillText("Game Over: Press to Restart", gridWidth / 4 - 11, gridHeight * 7 / 8);
    }
}

// Function to move the doodle based on user input
function moveDoodle(e) {
    if(e.code == "ArrowRight" || e.code == "KeyD") { 
        vx = 4; // Move to the right
        if(doodleRight.complete) {
            doodle.img = doodleRight;
        }
    }
    else if(e.code == "ArrowLeft" || e.code == "KeyA") { 
        vx = -4; // Move to the left
        if(doodleLeft.complete) {
            doodle.img = doodleLeft; 
        }
    }
    else if(e.code == "Space" && gameOver) {
        resetGame(); // Reset game if it's over and space is pressed
    }
}

// Function to spawn initial platforms
function spawnPlatforms() {
    platformArr = [];

    // Place the first platform at the center of the bottom
    let platform = {
        img : platformImg,
        x : gridWidth/2,
        y : gridHeight - 50,
        width : platformWidth,
        height : platformHeight
    }

    platformArr.push(platform);

    // Place additional platforms at random positions
    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * gridWidth * 3 / 4);
        let platform = {
            img : platformImg,
            x : randomX,
            y : gridHeight - 75 * i - 150,
            width : platformWidth,
            height : platformHeight
        }
    
        platformArr.push(platform);
    }
}

// Function to create a new platform at the top
function newPlatform() {
    let randomX = Math.floor(Math.random() * gridWidth * 3 / 4);
    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight
    }

    platformArr.push(platform);
}

// Function for collision detection between the doodle and a platform
function detectCollision(a, b) {
    const doodleBottom = a.y + a.height;
    const doodleFeetLanding = doodleBottom <= b.y + 5 && doodleBottom >= b.y - 5;

    const horizontalOverlap = a.x < b.x + b.width && a.x + a.width > b.x;
    
    return doodleFeetLanding && horizontalOverlap;
}

// Function to update the score
function updateScore() {
    let points = Math.floor(10 * Math.random()); 

    // Increase score when moving upwards
    if(vy < 0) { 
        maxScore += points;
        if(score < maxScore) {
            score = maxScore;
        }
    }

    // Decrease score when moving downwards
    else if(vy >= 0) {
        maxScore -= points;
    }
}

// Function to reset the game to its initial state
function resetGame() {
    doodle.img = doodleRight;
    doodle.x = doodleX;
    doodle.y = doodleY;
    doodle.width = doodleWidth;
    doodle.height = doodleHeight;
    vx = 0;
    vy = initvy;
    score = 0;
    maxScore = 0;
    gameOver = false;
    spawnPlatforms();
    gameStarted = false; // Reset game started flag
    document.addEventListener("keydown", checkStartGame);
    grid.addEventListener("click", startGame);
    grid.addEventListener("touchstart", startGame);
}

// Add touch listener to move the doodle on touch devices
document.addEventListener("touchstart", function(e) {
    e.preventDefault();
    moveDoodle({ code: "Space" }); 
});
