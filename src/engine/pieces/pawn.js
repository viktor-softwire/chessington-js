import Piece from './piece';
import Player from '../player';
import GameSettings from '../gameSettings';
import Square from '../square';

export default class Pawn extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {

        const position = {row: board.findPiece(this).row, col: board.findPiece(this).col}
        const direction = this.player === Player.WHITE ? 1 : -1;
        const possibleDirectionsToGo = [];

        // If possible to move by one
        if ((position.row + direction >= 0) && (position.row + direction < GameSettings.BOARD_SIZE)) {
            if (!board.getPiece(Square.at(position.row + direction, position.col))) {
                possibleDirectionsToGo.push(Square.at(position.row + direction, position.col));
            }
        }

        // If possible to move by two (starting position)
        if (((position.row === 6) && (this.player === Player.BLACK)) || ((position.row === 1) && (this.player === Player.WHITE))) {
            if (!board.getPiece(Square.at(position.row + 2*direction, position.col))) {
                possibleDirectionsToGo.push(Square.at(position.row + 2*direction, position.col));
            }
        }

        // Where can I hit (no En Passant)
        const possibleDirectionsToHit = [];

        if ((position.row + direction >= 0) && (position.row + direction < GameSettings.BOARD_SIZE)) {
            // Left side
            if (!!board.getPiece(Square.at(position.row + direction, position.col - 1)) && (board.getPiece(Square.at(position.row + direction, position.col - 1).player !== this.player))) {
                possibleDirectionsToHit.push(Square.at(position.row + direction, position.col - 1));
            }

            // Right side
            if (!!board.getPiece(Square.at(position.row + direction, position.col + 1)) && (Square.at(board.getPiece(position.row + direction, position.col + 1).player !== this.player))) {
                possibleDirectionsToHit.push(Square.at(position.row + direction, position.col + 1));
            }
        }

        return possibleDirectionsToGo.concat(possibleDirectionsToHit);
    }
}
