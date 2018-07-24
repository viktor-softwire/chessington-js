import GameSettings from "./gameSettings";

export default class Square {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }

    static at(row, col) {
        return new Square(row, col);
    }

    equals(otherSquare) {
        return !!otherSquare && this.row === otherSquare.row && this.col === otherSquare.col;
    }

    toString() {
        return `Row ${this.row}, Col ${this.col}`;
    }

    moveBy(deltaRow, deltaCol) {
        const newRow = this.row + deltaRow;
        const newCol = this.col + deltaCol;

        // Boundary check
        if ((newRow < 0) || (newRow >= GameSettings.BOARD_SIZE) || (newCol < 0) || (newCol >= GameSettings.BOARD_SIZE)) return null;

        return Square.at(newRow, newCol);
    }
}
