let gridSize = 8;
let mineCount = 10;
let board = [];

const gameBoard = document.getElementById("game-board");
const difficultyButtons = document.querySelectorAll(".difficulty-button");

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

// Initialize the game based on difficulty
function initializeGame() {
  board = [];
  gameBoard.style.display = 'grid';
  gameBoard.innerHTML = '';
  gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 30px)`;
  gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 30px)`;

  // Generate empty board
  for (let i = 0; i < gridSize; i++) {
    board.push([]);
    for (let j = 0; j < gridSize; j++) {
      board[i].push({ mine: false, revealed: false, flagged: false, surroundingMines: 0 });
    }
  }

  // Place mines randomly
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
        let surroundingMines = 0;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && board[nx][ny].mine) {
              surroundingMines++;
            }
          }
        }
        board[x][y].surroundingMines = surroundingMines;
      }
    }
  }

  // Create grid cells
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;

      // Left-click to reveal
      cell.addEventListener("click", () => revealCell(x, y));

      // Right-click to flag
      cell.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        flagCell(x, y);
      });

      gameBoard.appendChild(cell);
    }
  }
}

// Reveal cell function
function revealCell(x, y) {
  const cell = gameBoard.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  if (board[x][y].revealed || board[x][y].flagged) return;

  board[x][y].revealed = true;
  cell.style.backgroundColor = "#f1f1f1";
  if (board[x][y].mine) {
    cell.style.backgroundColor = "red"; // Mine hit
    alert("Game over!!!");
  } else {
    cell.textContent = board[x][y].surroundingMines || "";
    if (board[x][y].surroundingMines === 0) {
      // Automatically reveal adjacent cells if no surrounding mines
      revealAdjacent(x, y);
    }
  }
}

// Reveal adjacent cells (for empty spaces)
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

// Flag cell function
function flagCell(x, y) {
  const cell = gameBoard.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  if (board[x][y].revealed) return;

  board[x][y].flagged = !board[x][y].flagged;
  cell.textContent = board[x][y].flagged ? "🚩" : "";
}