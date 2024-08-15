let c = document.querySelector('canvas');
let ctx = c.getContext('2d');
let fps = 1000 / 60;
let timer = setInterval(main, fps);

let p1 = new GameObject(50, c.height / 2, 20, 100, 'rgba(255, 0, 0)');
let p2 = new GameObject(c.width - 50, c.height / 2, 20, 100, 'rgba(255, 0, 0)');
let ball = new GameObject(c.width / 2, c.height / 2, 20, 20, 'rgba(25, 25, 25)');
ball.vx = 5;
ball.vy = 3;

let friction = 0.9;
let paddleForce = 1.5;

document.addEventListener('keydown', function(e) {
    keys[e.key] = true;
});

document.addEventListener('keyup', function(e) {
    keys[e.key] = false;
});

function main() {
    ctx.clearRect(0, 0, c.width, c.height);

    // Player 1 controls (W, S)
    if (keys['w']) p1.vy -= paddleForce;
    if (keys['s']) p1.vy += paddleForce;

    // Player 2 controls (Up, Down)
    if (keys['ArrowUp']) p2.vy -= paddleForce;
    if (keys['ArrowDown']) p2.vy += paddleForce;

    p1.vy *= friction;
    p2.vy *= friction;

    p1.move();
    p2.move();

    // Ensure paddles stay within the canvas
    if (p1.y - p1.h / 2 < 0) p1.y = p1.h / 2;
    if (p1.y + p1.h / 2 > c.height) p1.y = c.height - p1.h / 2;
    if (p2.y - p2.h / 2 < 0) p2.y = p2.h / 2;
    if (p2.y + p2.h / 2 > c.height) p2.y = c.height - p2.h / 2;

    // Ball movement and collision with walls
    ball.move();

    if (ball.y - ball.h / 2 < 0 || ball.y + ball.h / 2 > c.height) {
        ball.vy = -ball.vy;
    }

    if (ball.x - ball.w / 2 < 0) {
        resetBall();
    }

    if (ball.x + ball.w / 2 > c.width) {
        resetBall();
    }

    // Ball collision with paddles
    if (collide(ball, p1)) {
        ball.vx = Math.abs(ball.vx);
        ball.x = p1.x + p1.w / 2 + ball.w / 2;
        generateParticles(ball, ball.x, ball.y); // Generate particles on collision
    }

    if (collide(ball, p2)) {
        ball.vx = -Math.abs(ball.vx);
        ball.x = p2.x - p2.w / 2 - ball.w / 2;
        generateParticles(ball, ball.x, ball.y); // Generate particles on collision
    }

    p1.render();
    p2.render();
    ball.render();

    renderParticles(); // Render particles
}

function collide(obj1, obj2) {
    return (
        obj1.x - obj1.w / 2 < obj2.x + obj2.w / 2 &&
        obj1.x + obj1.w / 2 > obj2.x - obj2.w / 2 &&
        obj1.y - obj1.h / 2 < obj2.y + obj2.h / 2 &&
        obj1.y + obj1.h / 2 > obj2.y - obj2.h / 2
    );
}

function resetBall() {
    ball.x = c.width / 2;
    ball.y = c.height / 2;
    ball.vx = -ball.vx;
}

let particles = [];

function generateParticles(ball, x, y) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            alpha: 1
        });
    }
}

function renderParticles() {
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        ctx.fillStyle = `rgba(255, 242, 117, ${p.alpha})`;
        ctx.fillRect(p.x, p.y, 2, 2);
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.09;
    }
    particles = particles.filter(p => p.alpha > 0);
}
