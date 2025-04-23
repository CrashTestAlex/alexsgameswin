const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 10, paddleHeight = 75;
let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;

let wPressed = false, sPressed = false;
let upPressed = false, downPressed = false;

const ballRadius = 8;
let initialSpeed = 5;
let x, y, dx, dy;

let leftScore = 0;
let rightScore = 0;
const winningScore = 10;
let isGameOver = false;

function resetBall() {
  x = canvas.width / 2;
  y = canvas.height / 2;
  dx = initialSpeed * (Math.random() > 0.5 ? 1 : -1);
  dy = initialSpeed * (Math.random() > 0.5 ? 1 : -1);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "w") wPressed = true;
  if (e.key === "s") sPressed = true;
  if (e.key === "ArrowUp") upPressed = true;
  if (e.key === "ArrowDown") downPressed = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "w") wPressed = false;
  if (e.key === "s") sPressed = false;
  if (e.key === "ArrowUp") upPressed = false;
  if (e.key === "ArrowDown") downPressed = false;
});

function drawPaddle(x, y) {
  ctx.fillStyle = "#ff6f00";
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#ff6f00";
  ctx.fill();
  ctx.closePath();
}

function drawScores() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "#ff6f00";
  ctx.fillText(`Player 1: ${leftScore}`, 50, 30);
  ctx.fillText(`Player 2: ${rightScore}`, canvas.width - 170, 30);
}

function drawWinner(winner) {
  ctx.font = "36px Arial";
  ctx.fillStyle = "#ff6f00";
  ctx.fillText(`${winner} Wins!`, canvas.width / 2 - 100, canvas.height / 2);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPaddle(0, leftPaddleY); // Left paddle (Player 1)
  drawPaddle(canvas.width - paddleWidth, rightPaddleY); // Right paddle (Player 2)
  drawBall();
  drawScores();

  if (isGameOver) {
    return;
  }

  // Ball movement
  if (y + dy < ballRadius || y + dy > canvas.height - ballRadius) dy = -dy;

  // Left paddle collision
  if (x + dx < paddleWidth) {
    if (y > leftPaddleY && y < leftPaddleY + paddleHeight) {
      dx = -dx * 1.05;
      dy = dy * 1.05;
    } else {
      rightScore++;
      if (rightScore >= winningScore) {
        isGameOver = true;
        drawWinner("Player 2");
        return;
      }
      resetBall();
    }
  }

  // Right paddle collision
  if (x + dx > canvas.width - paddleWidth - ballRadius) {
    if (y > rightPaddleY && y < rightPaddleY + paddleHeight) {
      dx = -dx * 1.05;
      dy = dy * 1.05;
    } else {
      leftScore++;
      if (leftScore >= winningScore) {
        isGameOver = true;
        drawWinner("Player 1");
        return;
      }
      resetBall();
    }
  }

  x += dx;
  y += dy;

  // Player 1 controls (W/S)
  if (wPressed && leftPaddleY > 0) leftPaddleY -= 5;
  if (sPressed && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += 5;

  // Player 2 controls (Arrow keys)
  if (upPressed && rightPaddleY > 0) rightPaddleY -= 5;
  if (downPressed && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += 5;

  requestAnimationFrame(draw);
}

resetBall();
draw();
