// Initialize canvas and context
const c = document.getElementById('gameCanvas');
const ctx = c.getContext('2d');

// Declare the player array
let player = [];

// Declare the pad array
let pad = [];

// Add new Player instances to the array
player[0] = new Player('Player 1', new Box(50, c.height / 2, 20, 100, 'rgba(255, 0, 0)'));
player[1] = new Player('Player 2', new Box(c.width - 50, c.height / 2, 20, 100, 'rgba(255, 0, 0)'));

// Assign paddles to the pad array
pad[0] = player[0].pad;
pad[1] = player[1].pad;

// Existing ball initialization
let ball = new GameObject(c.width / 2, c.height / 2, 20, 20, 'rgba(25, 25, 25)');

// Example game loop
function gameLoop() {
    ctx.clearRect(0, 0, c.width, c.height);
    
    // Update and render paddles
    pad.forEach(paddle => {
        paddle.move();
        constrainPaddles(paddle);
        paddle.render();
    });

    // Ball movement and collision handling
    ball.move();
    handleBallCollisionWithWalls();

    // Ball collision with paddles and scoring
    if (collide(ball, pad[0])) {
        ball.vx = Math.abs(ball.vx);
        ball.x = pad[0].x + pad[0].w / 2 + ball.w / 2;
        generateParticles(ball, ball.x, ball.y);
    }

    if (collide(ball, pad[1])) {
        ball.vx = -Math.abs(ball.vx);
        ball.x = pad[1].x - pad[1].w / 2 - ball.w / 2;
        generateParticles(ball, ball.x, ball.y);
    }

    // Render ball and particles
    ball.render();
    renderParticles();

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Function to constrain paddles within the canvas
function constrainPaddles(paddle) {
    if (paddle.y - paddle.h / 2 < 0) {
        paddle.y = paddle.h / 2;
    } else if (paddle.y + paddle.h / 2 > c.height) {
        paddle.y = c.height - paddle.h / 2;
    }
}

// Function to handle ball collision with walls and update scores
function handleBallCollisionWithWalls() {
    if (ball.y - ball.h / 2 < 0 || ball.y + ball.h / 2 > c.height) {
        ball.vy = -ball.vy;
    }
    if (ball.x - ball.w / 2 < 0) {
        player[1].updateScore(1); // Player 2 scores
        resetBall();
        logScores();
    } else if (ball.x + ball.w / 2 > c.width) {
        player[0].updateScore(1); // Player 1 scores
        resetBall();
        logScores();
    }
}

// Function to reset the ball's position and speed
function resetBall() {
    ball.x = c.width / 2;
    ball.y = c.height / 2;
    ball.vx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.vy = (Math.random() * 4) - 2;
}

// Function to log both players' scores in the format "0 | 0"
function logScores() {
    console.log(`${player[0].score} | ${player[1].score}`);
}

// Function to detect collision between two objects
function collide(obj1, obj2) {
    return obj1.x - obj1.w / 2 < obj2.x + obj2.w / 2 &&
           obj1.x + obj1.w / 2 > obj2.x - obj2.w / 2 &&
           obj1.y - obj1.h / 2 < obj2.y + obj2.h / 2 &&
           obj1.y + obj1.h / 2 > obj2.y - obj2.h / 2;
}

// Function to generate particles on collision
function generateParticles(ball, x, y) {
    const particles = [];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            color: `rgba(255, 64, 0, ${Math.random()})`,
            life: Math.random() * 20
        });
    }

    renderParticles(particles);
}

// Function to render particles
function renderParticles(particles) {
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
    });

    particles = particles.filter(p => p.life > 0);
}

// Function to handle input (optional, depending on your game setup)
function handleInput() {
    if (keys['w']) {
        pad[0].vy = -5;
    } else if (keys['s']) {
        pad[0].vy = 5;
    } else {
        pad[0].vy = 0;
    }

    if (keys['ArrowUp']) {
        pad[1].vy = -5;
    } else if (keys['ArrowDown']) {
        pad[1].vy = 5;
    } else {
        pad[1].vy = 0;
    }
}
