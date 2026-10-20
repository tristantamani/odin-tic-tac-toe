function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Marker());
        }
    }

    const placeMarker = (row, column, player) => {
        const emptyCell = board
            .filter((row) => row[column].getValue() === 0)
            .map((row) => row[column]);

        if (!emptyCell.length) return;
        board[row][column].addMarker(player);
    }

    const displayBoard = () => {
        const boardWithValues = board.map((row) =>
            row.map((cell) => cell.getValue())
        );
        console.log(boardWithValues);
    }

    return { placeMarker, displayBoard };
}

function Marker() {
    let value = 0;

    const addMarker = (player) => {
        value = player;
    }

    const getValue = () => value;

    return { addMarker, getValue };
}

function GameController(playerOne = "playerOne", playerTwo = "playerTwo") {
    const board = Gameboard();

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
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        console.log(
            `Placing ${getActivePlayer().name}'s marker into row ${row} ; column ${column}...`
        );
        board.placeMarker(row, column, getActivePlayer().marker);

        switchActivePlayer();
        displayNewRound();
    }

    displayNewRound();

    return { playRound, getActivePlayer };
}

const game = GameController();