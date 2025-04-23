let gridSize = 8;
let mineCount = 10;
let board = [];
let flagMode = false;
let gameOver = false;

const gameBoard = document.getElementById("game-board");
const difficultyButtons = document.querySelectorAll(".difficulty-button");
const flagToggleBtn = document.getElementById("flag-toggle");
const restartBtn = document.getElementById("restart-button");

// Handle difficulty selection
difficultyButtons.forEach(button => {
  button.addEventListener("click", () => {
    const difficulty = button.id;
    switch (difficulty) {
      case "easy":
        gridSize = 8;
        mineCount = 10;
        break;
      case "medium":
        gridSize = 10;
        mineCount = 15;
        break;
      case "hard":
        gridSize = 12;
        mineCount = 20;
        break;
    }
    initializeGame();
  });
});

// Flag mode toggle
flagToggleBtn.addEventListener("click", () => {
  flagMode = !flagMode;
  flagToggleBtn.textContent = `Flag Mode: ${flagMode ? 'ON' : 'OFF'}`;
  flagToggleBtn.classList.toggle("active", flagMode);
});

// Restart button
restartBtn.addEventListener("click", () => {
  initializeGame();
});

// Initialize game
function initializeGame() {
  board = [];
  gameOver = false;
  flagMode = false;
  flagToggleBtn.textContent = "Flag Mode: OFF";
  flagToggleBtn.classList.remove("active");

  gameBoard.style.display = 'grid';
  gameBoard.innerHTML = '';
  gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 30px)`;
  gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 30px)`;

  // Create empty board
  for (let i = 0; i < gridSize; i++) {
    board.push([]);
    for (let j = 0; j < gridSize; j++) {
      board[i].push({ mine: false, revealed: false, flagged: false, surroundingMines: 0 });
    }
  }

  // Place mines
  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    if (!board[x][y].mine) {
      board[x][y].mine = true;
      minesPlaced++;
    }
  }

  // Calculate surrounding mines
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (!board[x][y].mine) {
        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && board[nx][ny].mine) {
              count++;
            }
          }
        }
        board[x][y].surroundingMines = count;
      }
    }
  }

  // Create grid
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;

      // Left click
      cell.addEventListener("click", () => {
        if (gameOver) return;
        if (flagMode) {
          flagCell(x, y);
        } else {
          revealCell(x, y);
        }
      });

      // Right click (desktop)
      cell.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (gameOver) return;
        flagCell(x, y);
      });

      gameBoard.appendChild(cell);
    }
  }
}

// Reveal cell
function revealCell(x, y) {
  if (gameOver || board[x][y].revealed || board[x][y].flagged) return;

  const cell = gameBoard.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  board[x][y].revealed = true;
  cell.style.backgroundColor = "#f1f1f1";

  if (board[x][y].mine) {
    cell.style.backgroundColor = "red";
    cell.textContent = "💣";
    gameOver = true;
    revealAllMines();
    alert("Game Over!!");
    return;
  }

  cell.textContent = board[x][y].surroundingMines || "";
  if (board[x][y].surroundingMines === 0) {
    revealAdjacent(x, y);
  }

  checkWin();
}

// Reveal adjacent cells
function revealAdjacent(x, y) {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
        revealCell(nx, ny);
      }
    }
  }
}

// Flag cell
function flagCell(x, y) {
  if (board[x][y].revealed) return;

  const cell = gameBoard.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  board[x][y].flagged = !board[x][y].flagged;
  cell.textContent = board[x][y].flagged ? "🚩" : "";
}

// Reveal all mines
function revealAllMines() {
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (board[x][y].mine) {
        const cell = gameBoard.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (!board[x][y].flagged) {
          cell.textContent = "💣";
          cell.style.backgroundColor = "#ffeb3b";
        }
      }
    }
  }
}

// Check win condition
function checkWin() {
  let revealedCount = 0;
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (board[x][y].revealed) {
        revealedCount++;
      }
    }
  }

  if (revealedCount === gridSize * gridSize - mineCount) {
    gameOver = true;
    alert("You win!!");
  }
}