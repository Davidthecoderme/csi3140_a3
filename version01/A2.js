const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const resetButton = document.getElementById('resetButton');
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const playerNames = {
    'X': 'Player X',
    'O': 'Player O'
};

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    
    if (checkWinner()) {
        gameActive = false;
        statusText.textContent = `${playerNames[currentPlayer]} wins!`;
    } else if (!gameState.includes('')) {
        gameActive = false;
        statusText.textContent = 'It\'s a draw!';
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Player ${playerNames[currentPlayer]}'s turn`;
    }
}



function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    statusText.textContent = `Player ${playerNames[currentPlayer]}'s turn`;
    cells.forEach(cell => cell.textContent = '');
}

function checkWinner() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] !== '' && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return true;
        }
    }
    return false;
}



function editName(player) {
    const input = document.getElementById(`player${player}Name`);
    const button = document.getElementById(`player${player}Button`);
    
    if (input.readOnly) {
        input.readOnly = false;
        button.textContent = 'Save';
        input.focus();
        input.select();
    } else {
        input.readOnly = true;
        button.textContent = 'Edit';
        playerNames[player] = input.value;
        statusText.textContent = `${playerNames[currentPlayer]}'s turn (${currentPlayer})`;
    }
}


cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

statusText.textContent = `Player ${currentPlayer}'s turn`;
