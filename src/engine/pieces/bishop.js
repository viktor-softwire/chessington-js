import Piece from './piece';
import ColoredSquare from '../coloredSquare';
import Modifiers from '../modifiers';

export default class Bishop extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board, includeEnemyKing = false) {
        const possibleDirections = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
        const result = this.scanDirections(possibleDirections, board, Modifiers.REPEAT, includeEnemyKing);

        return result.possibleToGo.concat(result.possibleToHit);
    }


}
