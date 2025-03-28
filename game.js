// Basic structure for a wormate.io clone
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const wormSpeed = 2;
const wormSize = 10;
let worms = [];
let foods = [];

// Initialize worm
class Worm {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.body = [{ x: x, y: y }];
        this.dx = wormSpeed;
        this.dy = 0;
    }

    move() {
        const head = { x: this.body[0].x + this.dx, y: this.body[0].y + this.dy };
        this.body.unshift(head);

        if (!this.eatFood()) {
            this.body.pop();
        }
    }

    eatFood() {
        for (let i = 0; i < foods.length; i++) {
            if (Math.hypot(this.body[0].x - foods[i].x, this.body[0].y - foods[i].y) < wormSize) {
                foods.splice(i, 1);
                spawnFood();
                return true;
            }
        }
        return false;
    }

    draw() {
        ctx.fillStyle = this.color;
        this.body.forEach(segment => {
            ctx.beginPath();
            ctx.arc(segment.x, segment.y, wormSize / 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

// Food generator
function spawnFood() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    foods.push({ x, y });
}

// Input handler
window.addEventListener('keydown', (e) => {
    const worm = worms[0];
    switch (e.key) {
        case 'ArrowUp': worm.dy = -wormSpeed; worm.dx = 0; break;
        case 'ArrowDown': worm.dy = wormSpeed; worm.dx = 0; break;
        case 'ArrowLeft': worm.dx = -wormSpeed; worm.dy = 0; break;
        case 'ArrowRight': worm.dx = wormSpeed; worm.dy = 0; break;
    }
});

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw worms
    worms.forEach(worm => {
        worm.move();
        worm.draw();
    });

    // Draw food
    foods.forEach(food => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(food.x, food.y, wormSize / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    worms.push(new Worm(200, 200, 'blue'));
    for (let i = 0; i < 10; i++) spawnFood();
    gameLoop();
}

startGame();
