import Piece from './piece';
import GameSettings from '../gameSettings';
import Square from '../square';
import Player from '../player';
import ColoredSquare from '../coloredSquare';

export default class Rook extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        // Move in row upwards and downwards
        const rowUp = this.sweepRow(1, board);
        const rowDown = this.sweepRow(-1, board);

        // Move in col left and right
        const colLeft = this.sweepCol(-1, board);
        const colRight = this.sweepCol(1, board);

        const possibleDirectionsToGo = rowUp.possibleGo.concat(rowDown.possibleGo, colLeft.possibleGo, colRight.possibleGo);
        const possibleDirectionsToHit = rowUp.possibleHit.concat(rowDown.possibleHit, colLeft.possibleHit, colRight.possibleHit);

        return possibleDirectionsToGo.concat(possibleDirectionsToHit);
    }

    checkPiece(board, square) {
        if (!board.getPiece(square)) return ColoredSquare.EMPTY;
        if (board.getPiece(square).player === this.player) return ColoredSquare.ALLY;
        return ColoredSquare.ENEMY;
    }

    sweepRow(direction, board) {

        const position = board.findPiece(this);
        const possibleGo = [];
        const possibleHit = [];

        // Move in row until obstacle
        let currentRow = position.row + direction;
        while((currentRow < GameSettings.BOARD_SIZE) && (currentRow >= 0)) {
            const status = this.checkPiece(board, Square.at(currentRow, position.col));
            if (status === ColoredSquare.EMPTY) {
                possibleGo.push(Square.at(currentRow, position.col));
                currentRow += direction;   
                continue;
            }

            if (status === ColoredSquare.ENEMY) {
                possibleHit.push(Square.at(currentRow, position.col));
            }
            break;
        }

        return {'possibleGo': possibleGo, 'possibleHit': possibleHit};
    }

    sweepCol(direction, board) {

        const position = board.findPiece(this);
        const possibleGo = [];
        const possibleHit = [];

        // Move in row until obstacle
        let currentCol = position.col + direction;
        while((currentCol < GameSettings.BOARD_SIZE) && (currentCol >= 0)) {
            const status = this.checkPiece(board, Square.at(position.row, currentCol));
            if (status === ColoredSquare.EMPTY) {
                possibleGo.push(Square.at(position.row, currentCol));
                currentCol += direction;   
                continue;
            }

            if (status === ColoredSquare.ENEMY) {
                possibleHit.push(Square.at(position.row, currentCol));
            }
            break;
        }

        return {'possibleGo': possibleGo, 'possibleHit': possibleHit};
    }
}
