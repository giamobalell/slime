const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 320;

const tileSize = 16;
const tiles = canvas.width / tileSize;

let snake = [{ x: 8, y: 8 }];
let direction = { x: 1, y: 0 };
let apple = { x: Math.floor(Math.random() * tiles), y: Math.floor(Math.random() * tiles) };
let score = 0;

function drawTile(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}

function update() {
    // Move the snake
    let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Wrap-around logic (endless edges)
    if (head.x < 0) head.x = tiles - 1;
    if (head.x >= tiles) head.x = 0;
    if (head.y < 0) head.y = tiles - 1;
    if (head.y >= tiles) head.y = 0;

    // Check for self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
            return;
        }
    }

    // Check if the snake eats the apple
    if (head.x === apple.x && head.y === apple.y) {
        score++;
        apple = { x: Math.floor(Math.random() * tiles), y: Math.floor(Math.random() * tiles) };
        updateScore(); // Update score after eating apple
    } else {
        snake.pop(); // Remove the tail if no apple is eaten
    }

    snake.unshift(head); // Add the new head

    // Redraw the game
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw apple
    drawTile(apple.x, apple.y, 'red');

    // Draw snake
    snake.forEach((segment, index) => drawTile(segment.x, segment.y, index === 0 ? 'lime' : 'green'));
}

function resetGame() {
    snake = [{ x: 8, y: 8 }];
    direction = { x: 1, y: 0 };
    apple = { x: Math.floor(Math.random() * tiles), y: Math.floor(Math.random() * tiles) };
    score = 0;
    updateScore(); // Reset score on game over
}

// Function to update the score
function updateScore() {
    const scoreText = document.getElementById('scoreText');
    scoreText.textContent = `Score: ${score}`;
}

// Keyboard controls for desktop
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Touch controls for mobile
let touchStartX = null;
let touchStartY = null;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
    if (!touchStartX || !touchStartY) return;

    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction.x === 0) direction = { x: 1, y: 0 }; // Right swipe
        if (deltaX < 0 && direction.x === 0) direction = { x: -1, y: 0 }; // Left swipe
    } else {
        if (deltaY > 0 && direction.y === 0) direction = { x: 0, y: 1 }; // Down swipe
        if (deltaY < 0 && direction.y === 0) direction = { x: 0, y: -1 }; // Up swipe
    }

    touchStartX = null;
    touchStartY = null;
});

setInterval(update, 200);
