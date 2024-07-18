<?php


require_once ('./_config.php');

// Initialize game state and leaderboard if not already set
if (!isset($_SESSION['gameActive'])) {
    $_SESSION['gameState'] = ['', '', '', '', '', '', '', '', ''];
    $_SESSION['currentPlayer'] = 'X';
    $_SESSION['gameActive'] = true;
    $_SESSION['leaderboard'] = [];
}

function checkWinner($gameState) {
    $winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],  
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    foreach ($winningConditions as $condition) {
        list($a, $b, $c) = $condition;
        if ($gameState[$a] !== '' && $gameState[$a] === $gameState[$b] && $gameState[$a] === $gameState[$c]) {
            return true;
        }
    }
    return false;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    if ($action === 'move') {
        $index = intval($_POST['index']);
        if ($_SESSION['gameActive'] && $_SESSION['gameState'][$index] === '') {
            $_SESSION['gameState'][$index] = $_SESSION['currentPlayer'];
            if (checkWinner($_SESSION['gameState'])) {
                $_SESSION['gameActive'] = false;
                $_SESSION['leaderboard'][] = $_SESSION['currentPlayer'];
                $_SESSION['leaderboard'] = array_slice($_SESSION['leaderboard'], -10); // Keep only top 10
                $response = [
                    'status' => 'win',
                    'player' => $_SESSION['currentPlayer']
                ];
            } else if (!in_array('', $_SESSION['gameState'])) {
                $_SESSION['gameActive'] = false;
                $response = [
                    'status' => 'draw',
                    'player' => $_SESSION['currentPlayer']
                ];
            } else {
                $_SESSION['currentPlayer'] = $_SESSION['currentPlayer'] === 'X' ? 'O' : 'X';
                $response = [
                    'status' => 'continue',
                    'currentPlayer' => $_SESSION['currentPlayer']
                ];
            }
        } else {
            $response = ['status' => 'invalid'];
        }
    } else if ($action === 'reset') {
        $_SESSION['gameState'] = ['', '', '', '', '', '', '', '', ''];
        $_SESSION['currentPlayer'] = 'X';
        $_SESSION['gameActive'] = true;
        $response = ['status' => 'reset'];
    } else if ($action === 'continue') {
        $_SESSION['gameState'] = ['', '', '', '', '', '', '', '', ''];
        $_SESSION['currentPlayer'] = $_SESSION['currentPlayer'] === 'X' ? 'O' : 'X'; // Switch starting player
        $_SESSION['gameActive'] = true;
        $response = [
            'status' => 'continue',
            'currentPlayer' => $_SESSION['currentPlayer']
        ];
    }

    echo json_encode($response);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'leaderboard') {
    $leaderboard = array_count_values($_SESSION['leaderboard']);
    arsort($leaderboard); // Sort the leaderboard in descending order by score
    $leaderboardArray = [];
    foreach ($leaderboard as $player => $score) {
        $leaderboardArray[] = [
            'name' => $player,
            'score' => $score
        ];
    }
    echo json_encode($leaderboardArray);
    exit;
}

?>
