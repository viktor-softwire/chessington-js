import Player from './player';
import GameSettings from './gameSettings';
import Square from './square';
import ColoredSquare from './coloredSquare';
import King from './pieces/king';

export default class Board {
    constructor(currentPlayer) {
        this.currentPlayer = currentPlayer ? currentPlayer : Player.WHITE;
        this.board = this.createBoard();
        this.kings = {white: undefined, black: undefined};
    }

    createBoard() {
        const board = new Array(GameSettings.BOARD_SIZE);
        for (let i = 0; i < board.length; i++) {
            board[i] = new Array(GameSettings.BOARD_SIZE);
        }
        return board;
    }

    setPiece(square, piece) {
        this.board[square.row][square.col] = piece;

        // Keep track of kings; ASSUME ONLY ONE PER PLAYER
        if (piece instanceof King) {
            if (piece.player === Player.BLACK) this.kings.black = piece;
            if (piece.player === Player.WHITE) this.kings.white = piece; 
        }
    }

    getPiece(square) {
        return this.board[square.row][square.col];
    }

    findPiece(pieceToFind) {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col] === pieceToFind) {
                    return Square.at(row, col);
                }
            }
        }
        throw new Error('The supplied piece is not on the board');
    }

    movePiece(fromSquare, toSquare) {
        const movingPiece = this.getPiece(fromSquare);        
        if (!!movingPiece && movingPiece.player === this.currentPlayer) {
            this.setPiece(toSquare, movingPiece);
            this.setPiece(fromSquare, undefined);
            this.currentPlayer = (this.currentPlayer === Player.WHITE ? Player.BLACK : Player.WHITE);
        }
    }

    // Checks the realtion of square w.r.t. original piece
    // Returns ColoredSquare
    checkPiece(original, square) {
        const currentPiece = this.getPiece(square);
        if (!currentPiece) return ColoredSquare.EMPTY;
        if (currentPiece.player === original.player) return ColoredSquare.ALLY;
        if (currentPiece instanceof King) return ColoredSquare.ENEMY_KING;
        return ColoredSquare.ENEMY;
    }

    isKingChecked(player) {
        const king = player === Player.WHITE ? this.kings.white : this.kings.black;
        
        // If there are no kings 
        if (!king) return false;
    
        const kingPos = this.findPiece(king);

        for (let row = 0; row < GameSettings.BOARD_SIZE; row++) {
            for (let col = 0; col < GameSettings.BOARD_SIZE; col++) {
                const currentPiece = this.getPiece(Square.at(row, col));
                if (currentPiece) {
                    if (king.indexOfSquare(currentPiece.getAvailableMoves(this, true), kingPos) > -1) return true;
                }
            }
        }

        return false;
    }
}
