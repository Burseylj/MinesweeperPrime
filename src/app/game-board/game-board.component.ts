import { Component, Input, OnInit } from '@angular/core';
import { MatrixGeneratorService } from '../core/matrix-generator.service';
import { BinaryMatrix, Cell, Vector } from 'src/types/mspp-types';

@Component({
  selector: 'mspp-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {

  @Input()
  cells: Cell[][] = []
  @Input()
  adjacencies: Vector[] = []
  
  rows: number = 16;
  columns: number = 31;
  mines: number = 70;

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