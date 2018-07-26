import 'chai/register-should';
import King from '../../../src/engine/pieces/king';
import Pawn from '../../../src/engine/pieces/pawn';
import Board from '../../../src/engine/board';
import Player from '../../../src/engine/player';
import Square from '../../../src/engine/square';
import Rook from '../../../src/engine/pieces/rook';
import Knight from '../../../src/engine/pieces/knight';
import Queen from '../../../src/engine/pieces/queen';


describe('King', () => {

    let board;
    beforeEach(() => board = new Board());

    it('can move to adjacent squares', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(3, 4), king);

        const moves = king.getAvailableMoves(board);

        const expectedMoves = [
            Square.at(2, 3), Square.at(2, 4), Square.at(2, 5), Square.at(3, 5),
            Square.at(4, 5), Square.at(4, 4), Square.at(4, 3), Square.at(3, 3)
        ];

        moves.should.deep.include.members(expectedMoves);
    });

    it('cannot make any other moves', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(3, 4), king);

        const moves = king.getAvailableMoves(board);

        moves.should.have.length(8);
    });

    it('cannot leave the board', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(0, 0), king);

        const moves = king.getAvailableMoves(board);

        const expectedMoves = [Square.at(0, 1), Square.at(1, 1), Square.at(1, 0)];

        moves.should.deep.have.members(expectedMoves);
    });

    it('can take opposing pieces', () => {
        const king = new King(Player.WHITE);
        const opposingPiece = new Pawn(Player.BLACK);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), opposingPiece);

        const moves = king.getAvailableMoves(board);

        moves.should.deep.include(Square.at(5, 5));
    });

    it('cannot take the opposing king', () => {
        const king = new King(Player.WHITE);
        const opposingKing = new King(Player.BLACK);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), opposingKing);

        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(5, 5));
    });

    it('cannot take friendly pieces', () => {
        const king = new King(Player.WHITE);
        const friendlyPiece = new Pawn(Player.WHITE);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), friendlyPiece);

        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(5, 5));
    });

    it('can castle short if not moved and no piece inbetween', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 7), rook);

        const moves = king.getAvailableMoves(board);

        moves.should.deep.include(Square.at(0, 6));
    });

    it('can castle long if not moved and no piece inbetween', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 0), rook);

        const moves = king.getAvailableMoves(board);

        moves.should.deep.include(Square.at(0, 2));
    });

    it('rook also movoes during long castling', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 0), rook);

        king.moveTo(board, Square.at(0, 2));
        
        const expectedRook = board.getPiece(Square.at(0, 3));

        should.not.equal(expectedRook, undefined);
        expectedRook.should.instanceof(Rook);
        expectedRook.player.should.equal(Player.WHITE);
    });

    it('cannot castle if blocked', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);
        const knight = new Knight(Player.WHITE);
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 0), rook);
        board.setPiece(Square.at(0, 1), knight);

        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(0, 2));
    });

    it('cannot castle if already moved king', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);
        board.setPiece(Square.at(1, 4), king);
        board.setPiece(Square.at(0, 0), rook);

        king.moveTo(board, Square.at(0, 4));
        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(0, 2));
    })

    it('cannot castle if already moved rook', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(1, 0), rook);

        rook.moveTo(board, Square.at(0, 0));
        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(0, 2));
    })

    it('cannot castle if in chess', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);
        const enemyQueen = new Queen(Player.BLACK)
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 0), rook);
        board.setPiece(Square.at(4, 4), enemyQueen);

        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(0, 2));
    });

    it('cannot long castle if moves through threatened square', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);
        const enemyQueen = new Queen(Player.BLACK)
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 0), rook);
        board.setPiece(Square.at(3, 3), enemyQueen);

        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(0, 2));
    });

    it('cannot short castle if moves through threatened square', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);
        const enemyQueen = new Queen(Player.BLACK)
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 7), rook);
        board.setPiece(Square.at(5, 5), enemyQueen);

        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(0, 6));
    });

    it('cannot castle if ends up in chess', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);
        const enemyQueen = new Queen(Player.BLACK)
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 0), rook);
        board.setPiece(Square.at(7, 2), enemyQueen);

        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(0, 2));
    });

    it('can castle if rook moves through threatened square', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);
        const enemyRook = new Rook(Player.BLACK)
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 0), rook);
        board.setPiece(Square.at(1, 1), enemyRook);

        const moves = king.getAvailableMoves(board);
        moves.should.deep.include(Square.at(0, 2));
        
    });

    

    
});
