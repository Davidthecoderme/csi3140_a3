<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0">
    <title>Tic Tac Toe</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Tic Tac Toe</h1>
        <img src="./image/tictactoe.jpg" alt="Tic Tac Toe Logo">
    </header>

    <div class="game-container">
        <div class="player-info">
            <div>
                <label for="playerXName">Player X: </label>
                <input type="text" id="playerXName" value="Player X" readonly>
                <button id="playerXButton" onclick="editName('X')">Edit</button>
            </div>
            <div>
                <label for="playerOName">Player O: </label>
                <input type="text" id="playerOName" value="Player O" readonly>
                <button id="playerOButton" onclick="editName('O')">Edit</button>
            </div>
        </div>

        <div class="game-board">
            <div class="cell" data-index="0" id="0"></div>
            <div class="cell" data-index="1" id="1"></div>
            <div class="cell" data-index="2" id="2"></div>
            <div class="cell" data-index="3" id="3"></div>
            <div class="cell" data-index="4" id="4"></div>
            <div class="cell" data-index="5" id="5"></div>
            <div class="cell" data-index="6" id="6"></div>
            <div class="cell" data-index="7" id="7"></div>
            <div class="cell" data-index="8" id="8"></div>
        </div>

        <div class="game-info">
            <p class="status"></p>
            <p>If you want to restart the game, please click the reset button.</p>
            <div class="button-container">
                <button id="resetButton">Reset</button>
                <button id="continueButton" style="display: none;">Continue</button>
            </div>
        </div>

        <div class="scoreboard">
            <div class="score" id="playerXScore">X: 0</div>
            <div class="score" id="playerOScore">O: 0</div>
            <div class="score" id="tiesScore">TIES: 0</div>
        </div>

        <div class="leaderboard-container">
            <h3>Leaderboard</h3>
            <table id="leaderboard">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Leaderboard data will be inserted here -->
                </tbody>
            </table>
        </div>
    </div>

    <script src="a3.js"></script>
</body>
</html>
