const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const resetButton = document.getElementById('resetButton');
const playerXScoreElement = document.getElementById('playerXScore');
const playerOScoreElement = document.getElementById('playerOScore');
const tiesScoreElement = document.getElementById('tiesScore');
const leaderboardElement = document.getElementById('leaderboard');
const continueButton = document.getElementById('continueButton'); // Continue button
let gameActive = true; // Flag to track if the game is active

function handleClick(event) {
    if (!gameActive) return; // Prevent clicking if the game is not active

    const clickedCell = event.target;

    // Check if the clicked cell has the dataset.index attribute
    if (!clickedCell.dataset.index) {
        console.error('Clicked element does not have a data-index attribute');
        return;
    }

    const index = clickedCell.dataset.index;

    fetch('game.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'action=move&index=' + index
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Response from server:', data); // Debugging line

        if (data.status === 'win') {
            statusText.textContent = `${data.winner} wins!`;
            gameActive = false; // Set gameActive to false to disable further clicks
            updateScores(data.scores);
            updateLeaderboard(data.leaderboard);
            continueButton.style.display = 'block';
        } else if (data.status === 'draw') {
            gameActive = false; // Set gameActive to false to disable further clicks
            statusText.textContent = 'It\'s a draw!';
            updateScores(data.scores);
            continueButton.style.display = 'block';
        } else if (data.status === 'continue') {
            statusText.textContent = `Player ${data.currentPlayer}'s turn`;
            updateBoard(index, data.currentPlayer);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function resetGame() {
    fetch('game.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'action=reset'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'reset') {
            updateBoard();
            statusText.textContent = `Player ${data.currentPlayer}'s turn`;
            gameActive = true;
            continueButton.style.display = 'none'; // Hide continue button
        }
    })
    .catch(error => console.error('Error:', error));
    location.reload();
}

function updateBoard(index, currentPlayer) {
    const box = document.getElementById(index);
    if (gameActive === false) {
        box.innerHTML = currentPlayer;
    } else {
        box.innerHTML = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function updateNewBoard() {
    cells.forEach(cell => {
        cell.textContent = '';
    });
}

function updateScores(scores) {
    playerXScoreElement.innerHTML = `Player X: ${scores.X}`;
    playerOScoreElement.innerHTML = `Player O: ${scores.O}`;
    tiesScoreElement.innerHTML = `TIES: ${scores.TIES}`;
}

function updateLeaderboard(leaderboard) {
    const leaderboardBody = document.querySelector('#leaderboard tbody');
    leaderboardBody.innerHTML = ''; // Clear existing rows

    leaderboard.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.score}</td>
        `;
        leaderboardBody.appendChild(row);
    });
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
        fetch('game.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=updateName&player=${player}&name=${input.value}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                statusText.textContent = `${data.currentPlayer}'s turn (${data.currentPlayer})`;
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function continueGame() {
    fetch('game.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'action=continue'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'continue') {
            gameActive = true;
            updateNewBoard();
            statusText.textContent = `${data.currentPlayer}'s turn`;
            continueButton.style.display = 'none'; // Hide continue button
        }
    })
    .catch(error => console.error('Error:', error));
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
continueButton.addEventListener('click', continueGame);

statusText.textContent = `Player's turn`;
