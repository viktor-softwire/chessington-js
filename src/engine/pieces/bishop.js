import Piece from './piece';
import ColoredSquare from '../coloredSquare';

export default class Bishop extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        const possibleDirections = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
        const result = this.scanDirections(possibleDirections, board);

        return result.possibleToGo.concat(result.possibleToHit);
    }


}
