// Initializing variables
const c = document.getElementById('gameCanvas');
const ctx = c.getContext('2d');

// Existing paddle and ball initialization
let p1 = new GameObject(50, c.height / 2, 20, 100, 'rgba(255, 0, 0)');
let p2 = new GameObject(c.width - 50, c.height / 2, 20, 100, 'rgba(255, 0, 0)');
let ball = new GameObject(c.width / 2, c.height / 2, 20, 20, 'rgba(25, 25, 25)');

// Player instances
let player1 = new Player('Player 1', p1);
let player2 = new Player('Player 2', p2);

function main() {
    ctx.clearRect(0, 0, c.width, c.height);
    handleInput();
    p1.move();
    p2.move();

    // Paddle boundary checks and ball movement
    constrainPaddles();
    ball.move();

    // Ball collision with walls
    handleBallCollisionWithWalls();

    // Ball collision with paddles and scoring
    if (collide(ball, player1.pad)) {
        player1.updateScore(1);
        ball.vx = Math.abs(ball.vx);
        ball.x = player1.pad.x + player1.pad.w / 2 + ball.w / 2;
        generateParticles(ball, ball.x, ball.y);
    }

    if (collide(ball, player2.pad)) {
        player2.updateScore(1);
        ball.vx = -Math.abs(ball.vx);
        ball.x = player2.pad.x - player2.pad.w / 2 - ball.w / 2;
        generateParticles(ball, ball.x, ball.y);
    }

    // Render paddles, ball, and particles
    p1.render();
    p2.render();
    ball.render();
    renderParticles();
}

function gameLoop() {
    main();
    requestAnimationFrame(gameLoop);
}

gameLoop(); // Start the game loop

function collide(obj1, obj2) {
    return obj1.x - obj1.w / 2 < obj2.x + obj2.w / 2 &&
           obj1.x + obj1.w / 2 > obj2.x - obj2.w / 2 &&
           obj1.y - obj1.h / 2 < obj2.y + obj2.h / 2 &&
           obj1.y + obj1.h / 2 > obj2.y - obj2.h / 2;
}

function handleInput() {
    // Paddle 1 (p1) controls: W and S keys
    if (keys['w']) {
        p1.vy = -5; // Move up
    } else if (keys['s']) {
        p1.vy = 5; // Move down
    } else {
        p1.vy = 0; // Stop
    }

    // Paddle 2 (p2) controls: Up and Down arrow keys
    if (keys['ArrowUp']) {
        p2.vy = -5; // Move up
    } else if (keys['ArrowDown']) {
        p2.vy = 5; // Move down
    } else {
        p2.vy = 0; // Stop
    }
}

function constrainPaddles() {
    // Constrain Paddle 1 (p1) within the canvas height
    if (p1.y - p1.h / 2 < 0) {
        p1.y = p1.h / 2;
    } else if (p1.y + p1.h / 2 > c.height) {
        p1.y = c.height - p1.h / 2;
    }

    // Constrain Paddle 2 (p2) within the canvas height
    if (p2.y - p2.h / 2 < 0) {
        p2.y = p2.h / 2;
    } else if (p2.y + p2.h / 2 > c.height) {
        p2.y = c.height - p2.h / 2;
    }
}

function handleBallCollisionWithWalls() {
    // Ball collision with top and bottom walls
    if (ball.y - ball.h / 2 < 0 || ball.y + ball.h / 2 > c.height) {
        ball.vy = -ball.vy; // Reverse vertical direction
    }

    // Ball goes out of bounds (left or right)
    if (ball.x - ball.w / 2 < 0) {
        player2.updateScore(1); // Player 2 scores
        resetBall();
    } else if (ball.x + ball.w / 2 > c.width) {
        player1.updateScore(1); // Player 1 scores
        resetBall();
    }
}

function resetBall() {
    ball.x = c.width / 2;
    ball.y = c.height / 2;
    ball.vx = (Math.random() > 0.5 ? 1 : -1) * 5; // Random direction
    ball.vy = (Math.random() * 4) - 2; // Random vertical speed
}

function generateParticles(ball, x, y) {
    const particles = [];
    const particleCount = 20; // Number of particles to generate

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4, // Random velocity on x-axis
            vy: (Math.random() - 0.5) * 4, // Random velocity on y-axis
            color: `rgba(255, 64, 0, ${Math.random()})`, // Yellow particles with random opacity
            life: Math.random() * 20 // Random lifespan
        });
    }

    renderParticles(particles);
}

function renderParticles(particles) {
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); // Draw particle as a small circle
        ctx.fillStyle = p.color;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
    });

    // Remove particles that have expired
    particles = particles.filter(p => p.life > 0);
}