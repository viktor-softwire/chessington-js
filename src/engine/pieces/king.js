import Piece from './piece';
import Square from '../square';
import Rook from './rook';
import Modifiers from '../modifiers';

export default class King extends Piece {
    constructor(player) {
        super(player);
    }

    // Need to overwrite MovePiece because of castling
    moveTo(board, newSquare) {
        const position = board.findPiece(this);

        // Moving rook if castling
        if (Math.abs(position.col - newSquare.col) > 1) {
            const corner = newSquare.col === 6 ? 7 : 0;
            const newRookCol = newSquare.col === 6 ? 5 : 3;
            const rook = board.getPiece(Square.at(position.row, corner));
            board.setPiece(Square.at(position.row, newRookCol), rook);
            board.setPiece(Square.at(position.row, corner), undefined);
            rook.hasBeenMoved = true;
        }

        // Doing the actual king move
        super.moveTo(board, newSquare);
    }


    getAvailableMoves(board, includeEnemyKing = false) {
        const possibleDirections = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
        const result = this.scanDirections(possibleDirections, board, !Modifiers.REPEAT, includeEnemyKing);

        // Handle castling  (only if rteal move i.e. includeEnemyKing === false)
        if (!this.hasBeenMoved && !includeEnemyKing) {
            // Short castling
            const checkedPos = [this.castlingCheck(board, 7), this.castlingCheck(board, 0)];
            checkedPos.forEach(pos => {
                if (pos) result.possibleToGo.push(pos);
            });
        }

        return result.possibleToGo.concat(result.possibleToHit);  
    }

    // Checks the conditions for castling
    // TODO: INCLUDE CHECKING RULES
    castlingCheck(board, col) {

        // Cannot castle if in check
        if (board.isKingChecked(this.player)) return null;

        const position = board.findPiece(this);
        const expectedRook = board.getPiece(Square.at(position.row, col));
        if (expectedRook && expectedRook.player === this.player && expectedRook instanceof Rook && !expectedRook.hasBeenMoved) {
            // Check the emptyness of base row
            const direction = col === 0 ? -1 : 1;
            const sweepBase = this.scanDirections([[position.row, direction]], board, Modifiers.REPEAT, Modifiers.INCLUDE_ENEMY_KING);
            if (this.indexOfSquare(sweepBase.possibleToGo, Square.at(position.row, col - direction)) > -1) {

                // Cannot castle if moves through threatened square
                if (!this.checkHypotheticalMove(Square.at(position.row, position.col + direction), board)) return null;
                // Cannot check if ends up in threatened square
                if (!this.checkHypotheticalMove(Square.at(position.row, position.col + 2*direction), board)) return null;

                return Square.at(position.row, position.col + 2*direction);
            }
        }
    }

}
