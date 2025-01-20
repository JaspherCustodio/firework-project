const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
const particles = [];

// Firework class
class Firework {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = 5;
        this.radius = 3;
        this.color = randomColor();
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.distanceToTarget = Math.hypot(targetX - x, targetY - y);
        this.traveled = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        const velocityX = Math.cos(this.angle) * this.speed;
        const velocityY = Math.sin(this.angle) * this.speed;

        this.x += velocityX;
        this.y += velocityY;
        this.traveled += Math.hypot(velocityX, velocityY);

        // Check if firework reached the target
        if (this.traveled >= this.distanceToTarget) {
            explode(this.x, this.y);
            return true; // Remove the firework
        }

        this.draw();
        return false;
    }
}

// Particle class
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 3 + 1;
        this.color = color;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 3 + 2;
        this.gravity = 0.05;
        this.opacity = 1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.speed *= 0.98; // Slow down
        this.opacity -= 0.02; // Fade out

        this.draw();
        return this.opacity > 0;
    }
}

// Functions
function randomColor() {
    const colors = ["red", "orange", "yellow", "lime", "cyan", "blue", "magenta"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function explode(x, y) {
    const color = randomColor();
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function addFirework() {
    const x = Math.random() * canvas.width;
    const targetX = Math.random() * canvas.width;
    const targetY = Math.random() * (canvas.height / 2);
    fireworks.push(new Firework(x, canvas.height, targetX, targetY));
}

function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Fade effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
        if (fireworks[i].update()) {
            fireworks.splice(i, 1); // Remove exploded firework
        }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        if (!particles[i].update()) {
            particles.splice(i, 1); // Remove faded particle
        }
    }

    requestAnimationFrame(animate);
}

// Create fireworks at intervals
setInterval(addFirework, 500);
animate();

// Resize canvas on window resize
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
