const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const resetButton = document.getElementById('resetButton');
const playerXScoreElement = document.getElementById('playerXScore');
const playerOScoreElement = document.getElementById('playerOScore');
const tiesScoreElement = document.getElementById('tiesScore');
const leaderboardElement = document.getElementById('leaderboard');
const continueButton = document.getElementById('continueButton'); // Continue button
var index;
let gameActive = true; // Flag to track if the game is active
let currentPlayer = 'X';
let playerNames = {
    'X': 'Player X',
    'O': 'Player O'
};

let playerScores = {
    'X': 0,
    'O': 0,
    'TIES': 0
};

let playerBoardScores = {
    'X': 0,
    'O': 0,
};

function handleClick(event) {
    if (!gameActive) return; // Prevent clicking if the game is not active

    const clickedCell = event.target;

    // Check if the clicked cell has the dataset.index attribute
    if (!clickedCell.dataset.index) {
        console.error('Clicked element does not have a data-index attribute');
        return;
    }

     index = clickedCell.dataset.index;

    console.log('Cell clicked:', index); // Debugging line

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
            
            statusText.textContent = `${playerNames[currentPlayer]} wins!`;
            //
            playerScores[currentPlayer]++;

            if (currentPlayer === 'X') {
                playerBoardScores['X'] += 3;
                if (playerBoardScores['O'] <= 0) {
                    playerBoardScores['O'] = 0;
                } else {
                    playerBoardScores['O']--;
                }
            } else { 
                playerBoardScores['O'] += 3;
                if (playerBoardScores['X'] <= 0) {
                    playerBoardScores['X'] = 0;
                } else {
                    playerBoardScores['X']--;
                }
            }
            console.log("current player is " + currentPlayer);

            console.log("current data player is " + data.currentPlayer);

            gameActive = false; // Set gameActive to false to disable further clicks
            updateScores();
            
            //currentPlayer = data.currentPlayer;
            updateLeaderboard();
            continueButton.style.display = 'block';
            
            
        } else if (data.status === 'draw') {
            gameActive = false; // Set gameActive to false to disable further clicks
            statusText.textContent = 'It\'s a draw!';
            playerScores['TIES']++;
            playerBoardScores[currentPlayer] += 1;
            updateScores();
            continueButton.style.display = 'block';
            

        } else if (data.status === 'continue') {
            currentPlayer = data.currentPlayer;
            statusText.textContent = `Player ${playerNames[currentPlayer]}'s turn`;
            
        }
        
        updateBoard(index,currentPlayer);
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally, update the UI to indicate an error
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
        console.log('Response from server:', data); // Debugging line
        if (data.status === 'reset') {
            updateBoard();
            statusText.textContent = `Player ${playerNames[currentPlayer]}'s turn`;
            gameActive = true;
            continueButton.style.display = 'none'; // Hide continue button
        }
    })
        .catch(error => console.error('Error:', error));
    location.reload();
}

function updateBoard(index, currentPlayer) {
    let box = document.getElementById(index);
    if (gameActive === false) { 
        return box.innerHTML = currentPlayer;
    }

    if (currentPlayer === 'X') {
        box.innerHTML= 'O';
    } else { 
        box.innerHTML = 'X';

    }
    
}

function updateNewBoard() {
    cells.forEach(cell => {
        cell.textContent = '';
    });
}

function updateScores() {
    playerXScoreElement.innerHTML = `${playerNames['X']}: ${playerScores['X']}`;
    playerOScoreElement.innerHTML = `${playerNames['O']}: ${playerScores['O']}`;
    tiesScoreElement.innerHTML = `TIES: ${playerScores['TIES']}`;
}

function updateLeaderboard() {
    fetch('game.php?action=leaderboard')
    .then(response => response.json())
    .then(data => {
        console.log('Leaderboard:', data); // Debugging line
        leaderboardElement.innerHTML = '<li>Rank | Player | Score</li>';
        data.forEach((player, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1} | ${playerNames[player.name]} | ${playerBoardScores[player.name]}`;
            leaderboardElement.appendChild(li);
        });
    })
    .catch(error => console.error('Error:', error));
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

function continueGame() {
    fetch('game.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'action=continue'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'continue') {
            currentPlayer = data.currentPlayer;
            gameActive = true;
            updateNewBoard();
            statusText.textContent = `${playerNames[currentPlayer]}'s turn`;
            continueButton.style.display = 'none'; // Hide continue button
        }
    })
    .catch(error => console.error('Error:', error));
}

 cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
continueButton.addEventListener('click', continueGame);

// Call updateLeaderboard on page load and after each game update
//updateLeaderboard();
statusText.textContent = `Player ${currentPlayer}'s turn`;
