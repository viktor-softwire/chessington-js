import Piece from './piece';

export default class Knight extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        const possibleDirections = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
        const result = this.scanDirections(possibleDirections, board, false);

        return result.possibleToGo.concat(result.possibleToHit);
    }    
}
