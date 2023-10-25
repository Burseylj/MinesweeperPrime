export interface Cell {
    isMine: boolean,
    isRevealed: boolean,
    isMarked: boolean,
    adjacentMines: number
}

export interface Vector {
    x: number,
    y: number
}