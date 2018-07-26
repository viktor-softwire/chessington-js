import Piece from './piece';
import GameSettings from '../gameSettings';
import Square from '../square';
import Player from '../player';
import ColoredSquare from '../coloredSquare';
import Modifiers from '../modifiers';

export default class Rook extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board, includeEnemyKing = false) {

        const possibleDirections = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        const result = this.scanDirections(possibleDirections, board, Modifiers.REPEAT, includeEnemyKing);

        return result.possibleToGo.concat(result.possibleToHit);
    }

}
