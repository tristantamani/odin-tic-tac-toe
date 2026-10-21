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

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Marker());
        }
    };

    const getBoard = () => board.map((row) =>
        row.map((cell) => cell.getValue())
    );

    const placeMarker = (row, column, player) => {
        const emptyCell = board
            .filter((row) => row[column].getValue() === 0)
            .map((row) => row[column]);

        if (!emptyCell.length) return;
        board[row][column].addMarker(player);
    };

    const displayBoard = () => console.log(getBoard());

    const resetBoard = () => {
        board.splice(0, board.length);
        createBoard();
    };

    return { getBoard, placeMarker, displayBoard, resetBoard };
}

function Marker() {
    let value = 0;

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
        item => item !== " " && item === array[0]
    );

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

    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const displayNewRound = () => {
        board.displayBoard();
        checkWinner();

        if (gameOver && winner) {
            displayWinner();
            board.resetBoard();
            console.log(`NEW GAME! ${getActivePlayer().name}'s turn.`);
            board.displayBoard();
        } else {
            console.log(`${getActivePlayer().name}'s turn.`);
        }
    };

    const checkWinner = () => {
        const boardWithValues = board.getBoard();

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
    };

    const displayWinner = () => {
        for (player of players) {
            if (winner === player.marker) {
                console.log(`The winner is ${player.name}`);
            }
        }
    };

    const playRound = (row, column) => {
        const boardWithValues = board.getBoard();

        if (boardWithValues[row][column]) {
            console.log(`You cannot place your marker there! Try again.`)
            displayNewRound();
        } else {
            console.log(
                `Placing ${getActivePlayer().name}'s marker into row ${row} ; column ${column}...`
            );
            board.placeMarker(row, column, getActivePlayer().marker);

            switchActivePlayer();
            displayNewRound();
        }
    };

    displayNewRound();

    return { getActivePlayer, playRound, displayWinner };
}

const game = GameController();