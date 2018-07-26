import 'chai/register-should';
import Board from '../../src/engine/board';
import Pawn from '../../src/engine/pieces/pawn';
import Player from '../../src/engine/player';
import Square from '../../src/engine/square';
import King from '../../src/engine/pieces/king';
import Knight from '../../src/engine/pieces/knight';
import Queen from '../../src/engine/pieces/queen';
import Bishop from '../../src/engine/pieces/bishop';
import Rook from '../../src/engine/pieces/rook';

describe('Board', () => {

    describe('pawns', () => {

        let board;
        beforeEach(() => { // Common code executed before each test.
            board = new Board();
        });

        it('can be added to the board', () => {
            // Arrange
            const pawn = new Pawn(Player.WHITE);
            const square = Square.at(0, 0);

            // Act
            board.setPiece(square, pawn);

            // Assert
            board.getPiece(square).should.equal(pawn); // Object equality: same object reference
        });

        it('can be found on the board', () => {
            // Arrange
            const pawn = new Pawn(Player.WHITE);
            const square = Square.at(6, 4);

            // Act
            board.setPiece(square, pawn);

            // Assert
            board.findPiece(pawn).should.eql(square); // Object equivalence: different objects, same data
        });

    });

    describe('check', () => {
        
        let board;
        beforeEach(() => { // Common code executed before each test.
            board = new Board();
        });

        it('Checked by enemy piece - pawn', () => {
            const king = new King(Player.WHITE);
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(0, 0), king);
            board.setPiece(Square.at(1, 1), pawn);

            board.isKingChecked(Player.WHITE).should.eql(true);
        });

        it('Checked by enemy piece - knight', () => {
            const king = new King(Player.WHITE);
            const knight = new Knight(Player.BLACK);
            board.setPiece(Square.at(0, 0), king);
            board.setPiece(Square.at(1, 2), knight);

            board.isKingChecked(Player.WHITE).should.eql(true);
        });

        it('Checked by enemy piece - queen', () => {
            const king = new King(Player.WHITE);
            const queen = new Queen(Player.BLACK);
            board.setPiece(Square.at(0, 0), king);
            board.setPiece(Square.at(1, 1), queen);

            board.isKingChecked(Player.WHITE).should.eql(true);
        });

        it('Checked by enemy piece - bishop', () => {
            const king = new King(Player.BLACK);
            const bishop = new Bishop(Player.WHITE);
            board.setPiece(Square.at(0, 0), king);
            board.setPiece(Square.at(1, 1), bishop);

            board.isKingChecked(Player.BLACK).should.eql(true);
        });
        
        it('Checked by enemy piece - rook', () => {
            const king = new King(Player.BLACK);
            const rook = new Rook(Player.WHITE);
            board.setPiece(Square.at(0, 0), king);
            board.setPiece(Square.at(1, 0), rook);

            board.isKingChecked(Player.BLACK).should.eql(true);
        });

        it('Not checked - "Threatened" by friendly piece', () => {
            const king = new King(Player.WHITE);
            const rook = new Rook(Player.WHITE);
            board.setPiece(Square.at(0, 0), king);
            board.setPiece(Square.at(1, 0), rook);

            board.isKingChecked(Player.WHITE).should.eql(false);
        });

        it('Must move out of check (trying to move with rook)', () => {
            const king = new King(Player.BLACK);
            const rook = new Rook(Player.BLACK);
            const enemyQueen = new Queen(Player.WHITE)
            board.setPiece(Square.at(0, 0), king);
            board.setPiece(Square.at(1, 0), rook);
            board.setPiece(Square.at(0, 3), enemyQueen);

            board.isKingChecked(Player.BLACK).should.eql(true);
            rook.getAvailableMoves(board).should.have.length(0);
        });

        it('Must move out of check (trying to move with pawn)', () => {
            const king = new King(Player.WHITE);
            const pawn = new Pawn(Player.WHITE);
            const enemyRook = new Rook(Player.BLACK)
            board.setPiece(Square.at(0, 0), king);
            board.setPiece(Square.at(1, 0), pawn);
            board.setPiece(Square.at(0, 3), enemyRook);

            board.isKingChecked(Player.WHITE).should.eql(true);
            pawn.getAvailableMoves(board).should.have.length(0);

        });

        it('Must move out of check (trying to move with king)', () => {
            const king = new King(Player.BLACK);
            const enemyQueen = new Queen(Player.WHITE)
            board.setPiece(Square.at(1, 0), king);
            board.setPiece(Square.at(0, 0), enemyQueen);

            board.isKingChecked(Player.BLACK).should.eql(true);
            king.getAvailableMoves(board).should.have.length(1);
            king.getAvailableMoves(board).should.deep.include(Square.at(2, 1));
        });

        it('Can block check (bishop)', () => {
            const king = new King(Player.BLACK);
            const bishop = new Bishop(Player.BLACK)
            const enemyQueen = new Queen(Player.WHITE)
            board.setPiece(Square.at(0, 0), king);
            board.setPiece(Square.at(4, 0), enemyQueen);
            board.setPiece(Square.at(2, 2), bishop);

            board.isKingChecked(Player.BLACK).should.eql(true);
            bishop.getAvailableMoves(board).should.have.length(1);
            bishop.getAvailableMoves(board).should.deep.include(Square.at(2, 0));
            
        });

        it('Can block check (pawn)', () => {
            const king = new King(Player.BLACK);
            const pawn = new Pawn(Player.BLACK)
            const enemyQueen = new Queen(Player.WHITE)
            board.setPiece(Square.at(0, 0), king);
            board.setPiece(Square.at(4, 4), enemyQueen);
            board.setPiece(Square.at(1, 3), pawn);

            board.isKingChecked(Player.BLACK).should.eql(true);
            pawn.getAvailableMoves(board).should.have.length(1);
            pawn.getAvailableMoves(board).should.deep.include(Square.at(3, 3));
            
        });

        it('Cannot move into check (moving with king)', () => {
            const king = new King(Player.BLACK);
            const enemyQueen = new Queen(Player.WHITE)
            board.setPiece(Square.at(0, 0), king);
            board.setPiece(Square.at(1, 3), enemyQueen);
        
            board.isKingChecked(Player.BLACK).should.eql(false);
            king.getAvailableMoves(board).should.have.length(1);
            king.getAvailableMoves(board).should.deep.include(Square.at(1, 0));
            
        });

        it('Cannot move into check (exposing with rook)', () => {
            const king = new King(Player.BLACK);
            const rook = new Rook(Player.BLACK)
            const enemyQueen = new Queen(Player.WHITE)
            board.setPiece(Square.at(0, 0), king);
            board.setPiece(Square.at(2, 0), enemyQueen);
            board.setPiece(Square.at(1, 0), rook);

            board.isKingChecked(Player.BLACK).should.eql(false);
            rook.getAvailableMoves(board).should.have.length(0);
            
        });

        it('Cannot move into check (exposing with pawn)', () => {
            const king = new King(Player.WHITE);
            const pawn = new Pawn(Player.WHITE)
            const enemyQueen = new Queen(Player.BLACK)
            board.setPiece(Square.at(1, 0), king);
            board.setPiece(Square.at(1, 2), enemyQueen);
            board.setPiece(Square.at(1, 1), pawn);

            board.isKingChecked(Player.WHITE).should.eql(false);
            pawn.getAvailableMoves(board).should.have.length(0);
            
        });

    });
});
