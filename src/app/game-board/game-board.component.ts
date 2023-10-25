import { Component, OnInit } from '@angular/core';
import { MatrixGeneratorService } from '../core/matrix-generator.service';
import { Cell, Vector } from './game-board.model';
import { BinaryMatrix } from 'src/types/mspp-types';

@Component({
  selector: 'mspp-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {

  cells: Cell[][] = []
  minefield: BinaryMatrix = [];
  rows: number = 16;
  columns: number = 31;
  mines: number = 70;
  adjacencies: Vector[] = [
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: -1 }
  ];

  constructor(private matrixGeneratorService: MatrixGeneratorService) {
    this.cells = this.getCells(matrixGeneratorService.getUnstructuredMatrixWithHoles(this.rows, this.columns, this.mines, 2))
  }

  getCells(matrix: BinaryMatrix): Cell[][] {

    return matrix.map((row, rowIndex) => {
      return row.map((element, colIndex) => {
        const hasMine = element === 1

        const adjacentMines = this.countAdjacentMines(rowIndex, colIndex, matrix);

        return {
          isMine: hasMine,
          isRevealed: false,
          isMarked: false,
          adjacentMines: adjacentMines
        };
      });
    });
  }

  private countAdjacentMines(rowIndex: number, colIndex: number, matrix: BinaryMatrix) {
    let adjacentMines = 0
    for (const { x, y } of this.adjacencies) {
      const newRow = rowIndex + x;
      const newCol = colIndex + y;
      if (newRow >= 0 && newRow < matrix.length && newCol >= 0 && newCol < matrix[0].length) {
        if (matrix[newRow][newCol] === 1) {
          adjacentMines++;
        }
      }
    }
    return adjacentMines;
  }

  ngOnInit(): void {
  }

  cellClicked(row: number, column: number, $event: MouseEvent): void {
    const cell = this.cells[row][column];

    if (!cell.isMarked) {

      if (cell.isMine) {
        alert("Game Over: You clicked on a mine!");
        cell.isRevealed = true
        return;
      } else {

        this.revealAdjacentCells(row, column)
      }
    }
  }

  revealAdjacentCells(row: number, column: number): void {

    const stack: { row: number, col: number }[] = [{ row, col: column }];

    while (stack.length > 0) {
      const { row, col } = stack.pop()!;

      if (!(this.cells[row][col].isRevealed || this.cells[row][col].isMarked)) {
        this.cells[row][col].isRevealed = true;

        if (this.cells[row][col].adjacentMines === 0) {
          for (const { x, y } of this.adjacencies) {
            const newRow = row + x;
            const newCol = col + y;

            if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.columns) {
              stack.push({ row: newRow, col: newCol });
            }
          }
        }
      }
    }
  }


  cellRightClicked(rowIdx: number, colIdx: number, $event: MouseEvent): void {
    $event.preventDefault()
    const cell = this.cells[rowIdx][colIdx];

    if (!cell.isRevealed) {
      cell.isMarked = !cell.isMarked;
    }
  }

  getCellContent(cell: Cell): string {
    if (cell.isMarked) {
      return 'X';
    }

    if (cell.isRevealed) {
      if (cell.isMine) {
        return 'M';
      } else if (cell.adjacentMines === 0) {
        return '';
      } else {
        return cell.adjacentMines.toString();
      }
    }

    return '';
  }
}