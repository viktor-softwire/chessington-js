import Piece from './piece';
import Modifiers from '../modifiers';

export default class Knight extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board, includeEnemyKing) {
        const possibleDirections = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
        const result = this.scanDirections(possibleDirections, board, !Modifiers.REPEAT, includeEnemyKing);

        return result.possibleToGo.concat(result.possibleToHit);
    }    
}
