import Piece from './piece';
import Player from '../player';
import GameSettings from '../gameSettings';
import Square from '../square';
import ColoredSquare from '../coloredSquare';

export default class Pawn extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board, includeEnemyKing = false) {

        const position = board.findPiece(this);
        const direction = this.player === Player.WHITE ? 1 : -1;
        const possibleDirectionsToGo = [];
        
        // If possible to move by one
        const singleSquare = position.moveBy(direction, 0);
        if ((singleSquare) && (board.checkPiece(this, singleSquare) === ColoredSquare.EMPTY)) {
            possibleDirectionsToGo.push(singleSquare);
            
            // If possible to move by two (starting position)
            if (((position.row === 6) && (this.player === Player.BLACK)) || ((position.row === 1) && (this.player === Player.WHITE))) {
                const doubleSquare = position.moveBy(2*direction, 0);
                if ((doubleSquare) && (board.checkPiece(this, doubleSquare) === ColoredSquare.EMPTY)) {
                    possibleDirectionsToGo.push(doubleSquare);
                }
            }
        }

        // Where can I hit (no En Passant)
        const possibleDirectionsToHit = [];

        // Checking whether there's an upper row
        const upSquare = position.moveBy(direction, 0);
        if (upSquare) {
            // Left side
            const leftSquare = upSquare.moveBy(0, -1);
            if ((leftSquare) && (board.checkPiece(this, leftSquare) === ColoredSquare.ENEMY || (board.checkPiece(this, leftSquare) === ColoredSquare.ENEMY_KING && includeEnemyKing))) {
                possibleDirectionsToHit.push(leftSquare);
            }
            
            const rightSquare = upSquare.moveBy(0, 1);
            // Right side
            if ((rightSquare) && (board.checkPiece(this, rightSquare) === ColoredSquare.ENEMY || (board.checkPiece(this, rightSquare) === ColoredSquare.ENEMY_KING && includeEnemyKing))) {
                possibleDirectionsToHit.push(rightSquare);
            }
        }

        return possibleDirectionsToGo.concat(possibleDirectionsToHit);
    }
}
