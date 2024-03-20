const gameContainer = document.getElementById('gameContainer');
const startScreenImage = document.getElementById('startScreenImage');
const gameOverScreen = document.getElementById('gameOverScreen');
const tryAgainButton = document.getElementById('tryAgainButton');
const scoreBox = document.getElementById('scoreBox');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const dinoImg = new Image();
dinoImg.src = 'dino.jpg'; 
dinoImg.width = 50;
dinoImg.height = 50;

const treeImg = new Image();
treeImg.src = 'obstacle.png'; 
treeImg.width = 50;
treeImg.height = 50;

const dino = {
    x: 50,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    jumping: false,
    jumpHeight: 100,
    jumpCount: 0
};

const obstacles = [];
const obstacleWidth = 50;
const obstacleHeight = 50;
const obstacleSpeed = 5;
const obstacleSpawnInterval = 2000; 

let score = 0;
let gameStarted = false;
let gameStopped = false; 

function drawDino() {
    ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
}

function drawObstacles() {
    for (const obstacle of obstacles) {
        if (obstacle.type === 'obstacle') {
            ctx.drawImage(treeImg, obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
        } 
    }
}

function jump() {
    if (!dino.jumping && gameStarted) {
        dino.jumping = true;
        dino.jumpCount = 0;
    }
}

function update() {
    if (dino.jumping) {
        dino.y -= 5;
        dino.jumpCount += 5;

        if (dino.jumpCount >= dino.jumpHeight) {
            dino.jumping = false;
        }
    } else if (dino.y < canvas.height - dino.height) {
        dino.y += 5;
    }

    if (!gameStopped) {
        for (const obstacle of obstacles) {
            obstacle.x -= obstacleSpeed;

            if (
                dino.x < obstacle.x + obstacleWidth &&
                dino.x + dino.width > obstacle.x &&
                dino.y < obstacle.y + obstacleHeight &&
                dino.y + dino.height > obstacle.y
            ) {
                gameOver();
                return;
            }

            if (dino.x > obstacle.x + obstacleWidth && !obstacle.passed) {
                obstacle.passed = true;
                score += 10;
            }
        }

        obstacles.forEach((obstacle, index) => {
            if (obstacle.x + obstacleWidth < 0) {
                obstacles.splice(index, 1);
            }
        });

        if (Math.random() < 0.02) {
            const obstacleType = Math.random() < 0.5 ? 'obstacle' : null;
            if (obstacleType) {
                obstacles.push({ x: canvas.width, y: canvas.height - obstacleHeight, type: obstacleType, passed: false });
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawObstacles();
    drawDino();

    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function gameOver() {
    gameStopped = true;
    gameOverScreen.style.display = 'flex';
    scoreBox.innerHTML = '<h2>Your Score: ' + score + '</h2>';
}

function tryAgain() {
    gameStopped = false; 
    resetGame();
    startGame();
}

function resetGame() {
    obstacles.length = 0;
    dino.y = canvas.height - 50;
    score = 0;
    gameStarted = false;
    gameOverScreen.style.display = 'none';
    showStartScreen();
}

function gameLoop() {
    if (gameStarted) {
        update();
        draw();

        if (!gameStopped) {
            requestAnimationFrame(gameLoop);
        }
    }
}

function startGame() {
    hideStartScreen();
    gameStarted = true;
    requestAnimationFrame(gameLoop);
}

function showStartScreen() {
    startScreenImage.style.display = 'block';
    canvas.style.display = 'none';
}

function hideStartScreen() {
    startScreenImage.style.display = 'none';
    canvas.style.display = 'block';
}

// Eveniment pentru a începe jocul la încărcarea paginii
window.addEventListener('load', function() {
    // Adăugați evenimentul onclick pentru buton
    document.getElementById('startButton').addEventListener('click', startGame);
});

document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        jump();
    }
});
