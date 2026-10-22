function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    const createBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Marker());
            }
        }
    };

    createBoard();

    const getBoard = () => board;

    const placeMarker = (row, column, player) => {
        const emptyCell = board
            .filter((row) => row[column].getValue() === "")
            .map((row) => row[column]);

        if (!emptyCell.length) return;
        board[row][column].addMarker(player);
    };

    const resetBoard = () => {
        board.splice(0, board.length);
        createBoard();
    };

    return { getBoard, placeMarker, resetBoard };
}

function Marker() {
    let value = "";

    const addMarker = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addMarker, getValue };
}

function GameController(playerOne = "playerOne", playerTwo = "playerTwo") {
    let gameOver = false;
    let winner = "";

    const board = Gameboard();

    const allEqual = array => array.every(
        value => value !== "" && value === array[0]
    );

    const allFilled = array => array.every(value => value !== "");

    const getWinner = () => winner;
    const getGameOver = () => gameOver;

    const players = [
        {
            name: playerOne,
            marker: "X",
        },
        {
            name: playerTwo,
            marker: "O"
        },
    ];

    const getPlayers = () => players;

    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const checkWinner = () => {
        const boardArray = board.getBoard();
        const boardWithValues = boardArray.map((row) =>
            row.map((cell) => cell.getValue())
        );

        if (
            allEqual(boardWithValues[0]) ||
            allEqual([boardWithValues[0][0], boardWithValues[1][0], boardWithValues[2][0]]) ||
            allEqual([boardWithValues[0][0], boardWithValues[1][1], boardWithValues[2][2]])
        ) {
            gameOver = true;
            winner = boardWithValues[0][0]
        } else if (allEqual(boardWithValues[1])) {
            gameOver = true;
            winner = boardWithValues[1][0]
        } else if (allEqual(boardWithValues[2])) {
            gameOver = true;
            winner = boardWithValues[2][0]
        } else if (allEqual([boardWithValues[0][1], boardWithValues[1][1], boardWithValues[2][1]])) {
            gameOver = true;
            winner = boardWithValues[0][1]
        } else if (
            allEqual([boardWithValues[0][2], boardWithValues[1][2], boardWithValues[2][2]]) ||
            allEqual([boardWithValues[0][2], boardWithValues[1][1], boardWithValues[2][0]])
        ) {
            gameOver = true;
            winner = boardWithValues[0][2]
        }

        if (allFilled(boardWithValues[0]) &&
            allFilled(boardWithValues[1]) &&
            allFilled(boardWithValues[2])
        ) {
            winner = "tie";
        }
    };

    const clearBoard = () => {
        board.resetBoard();
        gameOver = false;
        winner = "";
        activePlayer = players[0];
    };

    const playRound = (row, column) => {
        const boardArray = board.getBoard();
        const boardWithValues = boardArray.map((row) =>
            row.map((cell) => cell.getValue())
        );

        if (
            boardWithValues[row][column] === "" &&
            winner === ""
        ) {
            board.placeMarker(row, column, getActivePlayer().marker);
            checkWinner();
            switchActivePlayer();
        }
    };

    return {
        getWinner,
        getGameOver,
        getPlayers,
        getActivePlayer,
        playRound,
        getBoard: board.getBoard,
        clearBoard
    };
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const playerOne = prompt("Enter Player 1 name: ");
    const playerTwo = prompt("Enter Player 2 name: ");

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const players = game.getPlayers();
        const activePlayer = game.getActivePlayer();
        const winner = game.getWinner();
        const gameOver = game.getGameOver();

        players[0].name = playerOne ? playerOne : "playerOne";
        players[1].name = playerTwo ? playerTwo : "playerTwo"

        playerTurnDiv.textContent = `${activePlayer.name}'s turn (${activePlayer.marker})...`;

        const displayBoard = () => {
            board.forEach((cell, row) => {
                cell.forEach((cell, column) => {
                    const cellButton = document.createElement("button");
                    cellButton.classList.add("cell");
                    cellButton.dataset.row = row;
                    cellButton.dataset.column = column;
                    cellButton.textContent = cell.getValue();
                    boardDiv.appendChild(cellButton);
                });
            });
        }

        displayBoard();

        const displayRestartButton = () => {
            const button = document.querySelector(".button");
            if (document.querySelector(".reset")) {
                button.removeChild(document.querySelector(".reset"));
            }

            if (gameOver && winner !== "") {
                const reset = document.createElement("button");

                reset.classList.add("reset");
                reset.textContent = "Restart Game";
                button.appendChild(reset);

                reset.addEventListener("click", () => {
                    game.clearBoard();
                    updateScreen();
                });
            }

        }

        for (player of players) {
            if (winner === player.marker) {
                playerTurnDiv.textContent = `${player.name} wins!`;
                displayRestartButton();
            } else if (winner === "tie" && gameOver) {
                playerTurnDiv.textContent = `Nobody won, it's a TIE!`;
                displayRestartButton();
            }
        }
    };

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

ScreenController();