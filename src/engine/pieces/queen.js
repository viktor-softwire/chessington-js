import Piece from './piece';
import Modifiers from '../modifiers';

export default class Queen extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board, includeEnemyKing = false) {
        const possibleDirections = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
        const result = this.scanDirections(possibleDirections, board, Modifiers.REPEAT, includeEnemyKing);

        return result.possibleToGo.concat(result.possibleToHit);    
    }
}
