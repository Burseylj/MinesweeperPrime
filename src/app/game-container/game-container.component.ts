import { ChangeDetectorRef, Component } from '@angular/core';
import { AdjacencyConfig, AdjacencyType, BinaryMatrix, BoardgenAlgorithm, Cell, GameMode } from 'src/types/mspp-types';
import { MatrixGeneratorService } from '../core/matrix-generator.service';

@Component({
  selector: 'mspp-game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.scss']
})
export class GameContainerComponent {
  mode: GameMode = GameMode.GAME
  cells: Cell[][] = [];
  boardgenAlgoritm: BoardgenAlgorithm = BoardgenAlgorithm.Zero
  rows: number = 16;
  columns: number = 31;
  mines: number = 99;
  selectedAdjacencyType = AdjacencyType.Standard;
  adjacencies = AdjacencyConfig[this.selectedAdjacencyType];

  GameMode = GameMode

  //todo: set seed, set algorithm, button to reload that shows seed
  constructor(private matrixGeneratorService: MatrixGeneratorService, private cdr: ChangeDetectorRef) { }

  onBoardgenAlgorithmChanged(algorithm: BoardgenAlgorithm): void {
    this.boardgenAlgoritm = algorithm
  }

  onModeChanged(newMode: GameMode): void {
    this.mode = newMode;
  }

  onAdjacencyTypeChanged(adjacencyType: AdjacencyType): void {
    //this should probably be one object
    this.selectedAdjacencyType = adjacencyType
    this.adjacencies = AdjacencyConfig[this.selectedAdjacencyType];
  }

  startGame(): void {
    this.cells = this.getCells(this.getMatrix())
    console.log(this.cells)
    this.cdr.detectChanges()
  }

  private getMatrix(): BinaryMatrix {
    switch (this.boardgenAlgoritm) {
      case BoardgenAlgorithm.Zero:
        return this.matrixGeneratorService.getZeroMatrix(this.rows, this.columns);
      case BoardgenAlgorithm.Unstructured:
        return this.matrixGeneratorService.getUnstructuredMatrix(this.rows, this.columns, this.mines);
      case BoardgenAlgorithm.HoleEveryThree:
        return this.matrixGeneratorService.getUnstructuredMatrixWithHoles(this.rows, this.columns, this.mines, 3);
      case BoardgenAlgorithm.GaussianBlur:
        return this.matrixGeneratorService.getBlurredUnstructuredMatrix(this.rows, this.columns, this.mines);
      case BoardgenAlgorithm.TripleGaussianBlur:
        return this.matrixGeneratorService.getBlurredUnstructuredMatrix(this.rows, this.columns, this.mines, 3);
      case BoardgenAlgorithm.GaussianBlurWithUnstructured:
        return this.matrixGeneratorService.getUnstructuredMatrixWithGaussianClusters(this.rows, this.columns, this.mines)
    }
  }

  private getCells(matrix: BinaryMatrix): Cell[][] {
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
}
