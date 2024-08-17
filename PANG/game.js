// Initialize canvas and context
const c = document.getElementById('gameCanvas');
const ctx = c.getContext('2d');

// Declare the player array
let player = [];

// Add new Player instances to the array
player[0] = new Player('Player 1', new Box(50, c.height / 2, 20, 100, 'rgba(255, 0, 0)'));
player[1] = new Player('Player 2', new Box(c.width - 50, c.height / 2, 20, 100, 'rgba(255, 0, 0)'));

// Existing ball initialization
let ball = new GameObject(c.width / 2, c.height / 2, 20, 20, 'rgba(25, 25, 25)');

// Query selectors for the score divs
const scoreDivs = document.querySelectorAll('#score div');

// Example game loop
function gameLoop() {
    handleInput(); 
    ctx.clearRect(0, 0, c.width, c.height);

    // Update and render players' paddles
    player[0].pad.move();
    player[1].pad.move();

    // Constrain paddles within the canvas
    constrainPaddles(player[0].pad);
    constrainPaddles(player[1].pad);

    // Ball movement and collision handling
    ball.move();
    handleBallCollisionWithWalls();

    // Ball collision with paddles and scoring
    if (collide(ball, player[0].pad)) {
        ball.vx = Math.abs(ball.vx);
        ball.x = player[0].pad.x + player[0].pad.w / 2 + ball.w / 2;
        generateParticles(ball, ball.x, ball.y);
    }

    if (collide(ball, player[1].pad)) {
        ball.vx = -Math.abs(ball.vx);
        ball.x = player[1].pad.x - player[1].pad.w / 2 - ball.w / 2;
        generateParticles(ball, ball.x, ball.y);
    }

    // Render paddles, ball, and particles
    player[0].pad.render(ctx);
    player[1].pad.render(ctx);
    ball.render(ctx);
    renderParticles();

    // Update the scores in the HTML
    scoreDivs[0].innerText = player[0].score;
    scoreDivs[1].innerText = player[1].score;

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Function to constrain paddles within the canvas
function constrainPaddles(pad) {
    if (pad.y - pad.h / 2 < 0) {
        pad.y = pad.h / 2;
    } else if (pad.y + pad.h / 2 > c.height) {
        pad.y = c.height - pad.h / 2;
    }
}

// Function to handle ball collision with walls
function handleBallCollisionWithWalls() {
    if (ball.y - ball.h / 2 < 0 || ball.y + ball.h / 2 > c.height) {
        ball.vy = -ball.vy;
    }
    if (ball.x - ball.w / 2 < 0) {
        player[1].score += 1;
        console.log(`${player[0].score} | ${player[1].score}`);
        resetBall();
    } else if (ball.x + ball.w / 2 > c.width) {
        player[0].score += 1;
        console.log(`${player[0].score} | ${player[1].score}`);
        resetBall();
    }
}

// Function to reset the ball's position and speed
function resetBall() {
    ball.x = c.width / 2;
    ball.y = c.height / 2;
    ball.vx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.vy = (Math.random() * 4) - 2;
}

// Function to detect collision between two objects
function collide(obj1, obj2) {
    return obj1.x < obj2.x + obj2.w &&
           obj1.x + obj1.w > obj2.x &&
           obj1.y < obj2.y + obj2.h &&
           obj1.y + obj1.h > obj2.y;
}

let particles = []; // Add this at the top

function generateParticles(ball, x, y) {
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
}

function renderParticles() {
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
    });

    particles = particles.filter(p => p.life > 0); // Update global particles
}

// Function to handle input (optional, depending on your game setup)
function handleInput() {
    if (keys['w']) {
        player[0].pad.vy = -5;
    } else if (keys['s']) {
        player[0].pad.vy = 5;
    } else {
        player[0].pad.vy = 0;
    }

    if (keys['ArrowUp']) {
        player[1].pad.vy = -5;
    } else if (keys['ArrowDown']) {
        player[1].pad.vy = 5;
    } else {
        player[1].pad.vy = 0;
    }
}
