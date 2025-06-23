// Esperar a que el DOM cargue completamente
document.addEventListener('DOMContentLoaded', () => {
    // Elementos principales del DOM
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const message = document.getElementById('message');
    const resetBtn = document.getElementById('reset-btn');
    const currentPlayerDisplay = document.getElementById('current-player');
    const playerXScore = document.querySelector('#player-x .score');
    const playerOScore = document.querySelector('#player-o .score');
    const playerX = document.getElementById('player-x');
    const playerO = document.getElementById('player-o');

    // Estado del juego
    let currentPlayer = 'X';
    let gameState = Array(9).fill('');
    let gameActive = true;
    let scores = { X: 0, O: 0 };

    // Combinaciones ganadoras
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
        [0, 4, 8], [2, 4, 6]             // diagonales
    ];

    // Inicializa el tablero
    function init() {
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning-cell');
        });

        gameState.fill('');
        gameActive = true;
        message.textContent = '';
        updatePlayerDisplay();
    }

    // Manejador de clic en celdas
    function handleCellClick(e) {
        const clickedCell = e.target;
        const index = parseInt(clickedCell.getAttribute('data-index'));

        if (!gameActive || gameState[index] !== '') return;

        updateCell(clickedCell, index);
        checkResult();
    }

    // Actualiza celda con el símbolo del jugador actual
    function updateCell(cell, index) {
        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
    }

    // Verifica si hay ganador o empate
    function checkResult() {
        let roundWon = false;

        for (const [a, b, c] of winningConditions) {
            if (gameState[a] && gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                highlightWinningCells([a, b, c]);
                break;
            }
        }

        if (roundWon) {
            announceWinner(currentPlayer);
            updateScore(currentPlayer);
            gameActive = false;
        } else if (!gameState.includes('')) {
            announceDraw();
            gameActive = false;
        } else {
            changePlayer();
        }
    }

    // Destaca las celdas ganadoras
    function highlightWinningCells(indexes) {
        indexes.forEach(i => cells[i].classList.add('winning-cell'));
    }

    // Muestra mensaje de victoria
    function announceWinner(player) {
        message.textContent = `¡Jugador ${player} gana!`;
        message.style.color = player === 'X' ? 'var(--primary-color)' : 'var(--secondary-color)';
    }

    // Muestra mensaje de empate
    function announceDraw() {
        message.textContent = '¡Empate!';
        message.style.color = '#666';
    }

    // Cambia al jugador siguiente
    function changePlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updatePlayerDisplay();
    }

    // Actualiza el turno visual y la clase activa
    function updatePlayerDisplay() {
        currentPlayerDisplay.textContent = currentPlayer;
        currentPlayerDisplay.style.color = currentPlayer === 'X' ? 'var(--primary-color)' : 'var(--secondary-color)';
        playerX.classList.toggle('active', currentPlayer === 'X');
        playerO.classList.toggle('active', currentPlayer === 'O');
    }

    // Aumenta el puntaje del jugador ganador
    function updateScore(winner) {
        scores[winner]++;
        if (winner === 'X') playerXScore.textContent = scores.X;
        else playerOScore.textContent = scores.O;
    }

    // Reinicia todo al hacer clic en el botón
    resetBtn.addEventListener('click', () => {
        scores = { X: 0, O: 0 };
        playerXScore.textContent = '0';
        playerOScore.textContent = '0';
        init();
    });

    // Iniciar juego al cargar
    init();
});
