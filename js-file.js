/*
** The Gameboard represents the state of the board
** Each square holds a Cell (defined later)
** and we expose a dropToken method to be able to add Cells to squares
*/

function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // Create a 2d array that will represent the state of the game board
  // For this 2d array, row 0 will represent the top row and
  // column 0 will represent the left-most column.
  // This nested-loop technique is a simple and common way to create a 2d array.
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  // This will be the method of getting the entire board that our
  // UI will eventually need to render it.
  const getBoard = () => board;

  // For Tic Tac Toe, dropToken should place a token at a specific row and column if empty
  const dropToken = (row, column, player) => {
    if (board[row][column].getValue() !== 0) return false; // Invalid move
    board[row][column].addToken(player);
    return true;
  };

  // This method will be used to print our board to the console.
  // It is helpful to see what the board looks like after each turn as we play,
  // but we won't need it after we build our UI
  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues);
  };

  // Expose a method to check for a winner
  const checkWinner = () => {
    // Check rows
    for (let i = 0; i < rows; i++) {
      const rowVals = board[i].map(cell => cell.getValue());
      if (rowVals[0] !== 0 && rowVals[0] === rowVals[1] && rowVals[1] === rowVals[2]) {
        return rowVals[0];
      }
    }
    // Check columns
    for (let j = 0; j < columns; j++) {
      const colVals = [board[0][j].getValue(), board[1][j].getValue(), board[2][j].getValue()];
      if (colVals[0] !== 0 && colVals[0] === colVals[1] && colVals[1] === colVals[2]) {
        return colVals[0];
      }
    }
    // Check diagonals
    const diag1 = [board[0][0].getValue(), board[1][1].getValue(), board[2][2].getValue()];
    if (diag1[0] !== 0 && diag1[0] === diag1[1] && diag1[1] === diag1[2]) {
      return diag1[0];
    }
    const diag2 = [board[0][2].getValue(), board[1][1].getValue(), board[2][0].getValue()];
    if (diag2[0] !== 0 && diag2[0] === diag2[1] && diag2[1] === diag2[2]) {
      return diag2[0];
    }
    // Check for tie
    const isBoardFull = board.every(row => row.every(cell => cell.getValue() !== 0));
    if (isBoardFull) return "tie";
    // No winner yet
    return null;
  };

  // Here, we provide an interface for the rest of our
  // application to interact with the board
  return { getBoard, dropToken, printBoard, checkWinner };
}

/*
** A Cell represents one "square" on the board and can have one of
** 0: no token is in the square,
** 1: Player One's token,
** 2: Player 2's token
*/

function Cell() {
  let value = 0;

  // Accept a player's token to change the value of the cell
  const addToken = (player) => {
    value = player;
  };

  // How we will retrieve the current value of this cell through closure
  const getValue = () => value;

  return {
    addToken,
    getValue
  };
}

/* 
** The GameController will be responsible for controlling the 
** flow and state of the game's turns, as well as whether
** anybody has won the game
*/
function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 1
    },
    {
      name: playerTwoName,
      token: 2
    }
  ];

  let activePlayer = players[0];
  let gameOver = false;
  let lastWinner = null; // <-- Track winner for UI

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    if (!gameOver) {
      console.log(`${getActivePlayer().name}'s turn.`);
    }
  };

  // For Tic Tac Toe, playRound needs both row and column
  const playRound = (row, column) => {
    if (gameOver) {
      console.log("Game is over. Start a new game to play again.");
      return;
    }
    console.log(
      `Placing ${getActivePlayer().name}'s token at row ${row}, column ${column}...`
    );
    const validMove = board.dropToken(row, column, getActivePlayer().token);
    if (!validMove) {
      console.log("Invalid move! Try again.");
      return;
    }

    const winner = board.checkWinner();
    board.printBoard();
    if (winner === 1 || winner === 2) {
      console.log(`${players[winner - 1].name} wins!`);
      gameOver = true;
      lastWinner = winner;
      return;
    } else if (winner === "tie") {
      console.log("It's a tie!");
      gameOver = true;
      lastWinner = "tie";
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  // Initial play game message
  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard, // <-- Expose getBoard method
    isGameOver: () => gameOver, // <-- Expose gameOver
    getWinner: () => lastWinner, // <-- Expose winner
    getPlayers: () => players // <-- Expose players for UI
  };
}

// Make game variable accessible for restart
let game = GameController();

// ScreenController module
const ScreenController = (() => {
  // Use the containers from the HTML
  const boardContainer = document.getElementById('game-board');
  const statusDiv = document.getElementById('game-status');
  const restartBtn = document.getElementById('restart-btn');

  // Redraws the board and sets up cell buttons
  function updateScreen() {
    // Clear board
    boardContainer.innerHTML = '';
    const board = game.getBoard ? game.getBoard() : [];
    // Draw board
    for (let i = 0; i < 3; i++) {
      const rowDiv = document.createElement('div');
      rowDiv.classList.add('board-row');
      for (let j = 0; j < 3; j++) {
        const cellBtn = document.createElement('button');
        cellBtn.classList.add('cell-btn');
        cellBtn.setAttribute('data-row', i);
        cellBtn.setAttribute('data-col', j);
        cellBtn.textContent = board[i] && board[i][j] ?
          (board[i][j].getValue() === 1 ? 'X' : board[i][j].getValue() === 2 ? 'O' : '') : '';
        cellBtn.addEventListener('click', clickHandlerBoard);
        rowDiv.appendChild(cellBtn);
      }
      boardContainer.appendChild(rowDiv);
    }
    // Show current player's turn or game over status
    if (typeof game.isGameOver === 'function' && game.isGameOver()) {
      const winner = typeof game.getWinner === 'function' ? game.getWinner() : null;
      if (winner === 1 || winner === 2) {
        const players = typeof game.getPlayers === 'function' ? game.getPlayers() : [];
        statusDiv.textContent = `${players[winner - 1]?.name || "Player"} wins! Game Over.`;
      } else if (winner === "tie") {
        statusDiv.textContent = "It's a tie! Game Over.";
      } else {
        statusDiv.textContent = "Game Over.";
      }
    } else if (typeof game.getActivePlayer === 'function') {
      statusDiv.textContent = `${game.getActivePlayer().name}'s turn`;
    }
  }

  // Handles cell clicks
  function clickHandlerBoard(e) {
    const row = parseInt(e.target.getAttribute('data-row'));
    const col = parseInt(e.target.getAttribute('data-col'));
    game.playRound(row, col);
    updateScreen();
  }

  // Add restart button logic
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      game = GameController(); // New game instance
      updateScreen();
    });
  }

  // Initial render
  updateScreen();

  return { updateScreen, clickHandlerBoard };
})();