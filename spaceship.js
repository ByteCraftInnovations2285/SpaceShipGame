const canvas = document.getElementById('GameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load spaceship image
const spaceshipImg = new Image();
spaceshipImg.src = 'https://www.iconarchive.com/download/i106896/goodstuff-no-nonsense/free-space/space-ship.1024.png';
spaceshipImg.onload = () => {
    startGame(); // Start game after spaceship image is loaded
};

// Load rocket image
const rocketImg = new Image();
rocketImg.src = 'https://cdn-icons-png.flaticon.com/512/620/620386.png';

// Increase rocket size
const rocketWidth = 60; // Increased width of rocket
const rocketHeight = 30; // Increased height of rocket

// Spaceship class
class Spaceship {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 80;
        this.speed = 10;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(Math.PI / 2); // Rotate 90 degrees clockwise
        ctx.drawImage(spaceshipImg, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    moveLeft() {
        if (this.x > 0) {
            this.x -= this.speed;
        }
    }

    moveRight() {
        if (this.x < canvas.width - this.width) {
            this.x += this.speed;
        }
    }

    moveUp() {
        if (this.y > 0) {
            this.y -= this.speed;
        }
    }

    moveDown() {
        if (this.y < canvas.height - this.height) {
            this.y += this.speed;
        }
    }

    // Check collision with rocket
    checkCollision(rocket) {
        if (this.x < rocket.x + rocket.width &&
            this.x + this.width > rocket.x &&
            this.y < rocket.y + rocket.height &&
            this.y + this.height > rocket.y) {
            return true;
        }
        return false;
    }
}

// Rocket class
class Rocket {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.width = rocketWidth;
        this.height = rocketHeight;
        this.speed = speed;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(-Math.PI / 2); // Rotate 90 degrees counterclockwise
        ctx.drawImage(rocketImg, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    move() {
        this.x -= this.speed;
    }
}

// Create spaceship object
let spaceship;
function startGame() {
    spaceship = new Spaceship(canvas.width / 2 - 40, canvas.height / 2 - 40);
    animate();
}

let rockets = []; // Array to hold rockets
let gameActive = true; // Game state

// Function to generate rockets
function generateRockets() {
    let randomY = Math.random() * (canvas.height - rocketHeight); // Random Y position
    let speed = 5 + Math.random() * 5; // Random speed between 5 and 10
    let rocket = new Rocket(canvas.width, randomY, speed);
    rockets.push(rocket);
}

// Function to animate and update game state
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    spaceship.draw();

    // Generate rockets every 5 seconds
    if (Math.random() < 0.02) {
        generateRockets();
    }

    // Move and draw rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
        rockets[i].move();
        rockets[i].draw();

        // Check collision with spaceship
        if (spaceship.checkCollision(rockets[i])) {
            gameActive = false;
            endGame();
            return;
        }

        // Remove rockets that have moved off the screen
        if (rockets[i].x + rockets[i].width < 0) {
            rockets.splice(i, 1);
        }
    }

    if (gameActive) {
        requestAnimationFrame(animate);
    } else {
        // Show reset button and game over text
        document.getElementById('resetButton').classList.remove('hidden');
        document.getElementById('gameOverText').classList.remove('hidden');
    }
}

// Event listeners for keyboard controls
window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            spaceship.moveLeft();
            break;
        case 'ArrowRight':
            spaceship.moveRight();
            break;
        case 'ArrowUp':
            spaceship.moveUp();
            break;
        case 'ArrowDown':
            spaceship.moveDown();
            break;
    }
});

// Reset game function
document.getElementById('resetButton').addEventListener('click', () => {
    rockets = []; // Clear rockets array
    gameActive = true; // Reset game state

    // Hide reset button and game over text
    document.getElementById('resetButton').classList.add('hidden');
    document.getElementById('gameOverText').classList.add('hidden');

    // Start or restart the game
    startGame();
});

// Function to end the game
function endGame() {
    // Display game over text
    document.getElementById('gameOverText').classList.remove('hidden');

    // Display reset button
    document.getElementById('resetButton').classList.remove('hidden');
}

