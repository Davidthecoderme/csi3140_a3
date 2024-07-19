<?php
session_start();

function initializeGame() {
    $_SESSION['gameState'] = array_fill(0, 9, '');
    $_SESSION['currentPlayer'] = 'X';
    $_SESSION['playerScores'] = ['X' => 0, 'O' => 0, 'TIES' => 0];
    $_SESSION['playerBoardScores'] = ['X' => 0, 'O' => 0];
}

if (!isset($_SESSION['gameState'])) {
    initializeGame();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];

    switch ($action) {
        case 'move':
            handleMove($_POST['index']);
            break;
        case 'reset':
            resetGame();
            break;
        case 'continue':
            continueGame();
            break;
        case 'updateName':
            updatePlayerName($_POST['player'], $_POST['name']);
            break;
        default:
            break;
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
    if ($_GET['action'] === 'leaderboard') {
        getLeaderboard();
    }
}

function handleMove($index) {
    $index = (int)$index;

    if ($_SESSION['gameState'][$index] !== '' || $index < 0 || $index > 8) {
        echo json_encode(['status' => 'invalid']);
        exit;
    }

    $_SESSION['gameState'][$index] = $_SESSION['currentPlayer'];

    if (checkWin($_SESSION['currentPlayer'])) {
        $_SESSION['playerScores'][$_SESSION['currentPlayer']]++;
        if ($_SESSION['currentPlayer'] === 'X') {
            $_SESSION['playerBoardScores']['X'] += 3;
            $_SESSION['playerBoardScores']['O'] = max(0, $_SESSION['playerBoardScores']['O'] - 1);
        } else {
            $_SESSION['playerBoardScores']['O'] += 3;
            $_SESSION['playerBoardScores']['X'] = max(0, $_SESSION['playerBoardScores']['X'] - 1);
        }
        echo json_encode([
            'status' => 'win',
            'winner' => $_SESSION['currentPlayer'],
            'scores' => $_SESSION['playerScores'],
            'leaderboard' => getLeaderboardData()
        ]);
        exit;
    }

    if (checkDraw()) {
        $_SESSION['playerScores']['TIES']++;
        $_SESSION['playerBoardScores'][$_SESSION['currentPlayer']]++;
        echo json_encode([
            'status' => 'draw',
            'scores' => $_SESSION['playerScores'],
            'leaderboard' => getLeaderboardData()
        ]);
        exit;
    }

    $_SESSION['currentPlayer'] = $_SESSION['currentPlayer'] === 'X' ? 'O' : 'X';
    echo json_encode([
        'status' => 'continue',
        'currentPlayer' => $_SESSION['currentPlayer']
    ]);
}

function checkWin($player) {
    $winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    foreach ($winningCombinations as $combination) {
        if ($_SESSION['gameState'][$combination[0]] === $player &&
            $_SESSION['gameState'][$combination[1]] === $player &&
            $_SESSION['gameState'][$combination[2]] === $player) {
            return true;
        }
    }

    return false;
}

function checkDraw() {
    return !in_array('', $_SESSION['gameState'], true);
}

function resetGame() {
    initializeGame();
    echo json_encode(['status' => 'reset', 'currentPlayer' => $_SESSION['currentPlayer']]);
}

function continueGame() {
    $_SESSION['gameState'] = array_fill(0, 9, '');
    echo json_encode(['status' => 'continue', 'currentPlayer' => $_SESSION['currentPlayer']]);
}

function updatePlayerName($player, $name) {
    $_SESSION['playerNames'][$player] = $name;
    echo json_encode(['status' => 'success', 'currentPlayer' => $_SESSION['currentPlayer']]);
}

function getLeaderboard() {
    echo json_encode(getLeaderboardData());
}

function getLeaderboardData() {
    $leaderboard = [
        ['name' => 'X', 'score' => $_SESSION['playerBoardScores']['X']],
        ['name' => 'O', 'score' => $_SESSION['playerBoardScores']['O']]
    ];
    usort($leaderboard, function($a, $b) {
        return $b['score'] <=> $a['score'];
    });
    return $leaderboard;
}
?>
