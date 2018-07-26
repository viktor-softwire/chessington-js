import ColoredSquare from '../coloredSquare';

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

    sweepPattern(deltaRow, deltaCol, board, repeat = true, includeEnemyKing = false) {
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
            if (status === ColoredSquare.ENEMY_KING && includeEnemyKing) {
                possibleToHit.push(currentPosition);
            }
            break;
        }

        return {possibleGo: possibleToGo, possibleHit: possibleToHit};
    }

    scanDirections(directions, board, repeat = true, includeEnemyKing = false) {
        const possibleToGos = directions.map(x => {
            const result = this.sweepPattern(x[0], x[1], board, repeat, includeEnemyKing);
            return result.possibleGo;
        });
        const possibleToHits = directions.map(x => {
            const result = this.sweepPattern(x[0], x[1], board, repeat, includeEnemyKing);
            return result.possibleHit;
        });
        
        // Flattening arrays
        const possibleDirectionsToGo = [].concat.apply([], possibleToGos);
        const possibleDirectionsToHit = [].concat.apply([], possibleToHits);

        // If this is an actual move (i.e. includeEnemyKing === False)
        // Check every position for check
        if (!includeEnemyKing) {
            const checked = this.runCheckChecking({possibleToGo: possibleDirectionsToGo, possibleToHit: possibleDirectionsToHit}, board);
            return checked;  // In the format of {possibleToGo: ..., possibleToHit: ...}
        }

        return {possibleToGo: possibleDirectionsToGo, possibleToHit: possibleDirectionsToHit};
    }

    indexOfSquare(list, square) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].row === square.row && list[i].col === square.col) return i;
        }
        return -1;
    }

    // Checks the found possible moves whether it will cause check
    runCheckChecking(allPossibleMoves, board) {

        const possibleToGoWithoutCheck = [];
        const possibleToHitWithoutCheck = [];
        const origin = board.findPiece(this);

        allPossibleMoves.possibleToGo.forEach(step => {
            // Temporarly update board
            board.setPiece(origin, undefined);
            board.setPiece(step, this);

            if (!board.isKingChecked(this.player)) possibleToGoWithoutCheck.push(step);
            
            //Remove updates to board
            board.setPiece(origin, this);
            board.setPiece(step, undefined);
        });

        allPossibleMoves.possibleToHit.forEach(step => {
            // Temporarly update board
            const hitPiece = board.getPiece(step);
            board.setPiece(origin, undefined);
            board.setPiece(step, this);

            if (!board.isKingChecked(this.player)) possibleToHitWithoutCheck.push(step);
            
            //Remove updates to board
            board.setPiece(origin, this);
            board.setPiece(step, hitPiece);
        });
        
        // throw {possibleToGo: possibleToGoWithoutCheck, possibleToHit: possibleToHitWithoutCheck};
        return {possibleToGo: possibleToGoWithoutCheck, possibleToHit: possibleToHitWithoutCheck};

    }

    // Checks one hypothetical move
    checkHypotheticalMove(move, board) {
        const result = this.runCheckChecking({possibleToGo: [move], possibleToHit: []}, board);
        if (result.possibleToGo.length === 0) return false;
        return true;
    }
}
