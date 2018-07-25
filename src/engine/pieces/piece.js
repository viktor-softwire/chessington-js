import ColoredSquare from '../coloredSquare';
import MoveType from '../moveType';

export default class Piece {
    constructor(player) {
        this.player = player;
        this.hasBeenMoved = false;
    }

    getAvailableMoves(board) {
        throw new Error('This method must be implemented, and return a list of available moves');
    }

    moveTo(board, newSquare) {
        this.hasBeenMoved = true;
        const currentSquare = board.findPiece(this);
        board.movePiece(currentSquare, newSquare);
    }

    sweepPattern(deltaRow, deltaCol, board, repeat = true) {
        const startPosition = board.findPiece(this);
        const possibleToGo = [];
        const possibleToHit = [];
        let currentPosition = startPosition.moveBy(deltaRow, deltaCol);
        while (currentPosition) {
            const status = board.checkPiece(this, currentPosition);
            if (status === ColoredSquare.EMPTY) {
                possibleToGo.push(currentPosition);
                currentPosition = currentPosition.moveBy(deltaRow, deltaCol);
                if (!repeat) break;
                continue;
            }
            if (status === ColoredSquare.ENEMY) {
                possibleToHit.push(currentPosition);
            }
            break;
        }

        return {possibleGo: possibleToGo, possibleHit: possibleToHit};
    }

    scanDirections(directions, board, repeat = true) {
        const possibleToGos = directions.map(x => {
            const result = this.sweepPattern(x[0], x[1], board, repeat);
            return result.possibleGo;
        });
        const possibleToHits = directions.map(x => {
            const result = this.sweepPattern(x[0], x[1], board, repeat);
            return result.possibleHit;
        });
        
        // Flattening arrays
        const possibleDirectionsToGo = [].concat.apply([], possibleToGos);
        const possibleDirectionsToHit = [].concat.apply([], possibleToHits);

        return {possibleToGo: possibleDirectionsToGo, possibleToHit: possibleDirectionsToHit};
    }
}
