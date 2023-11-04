import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AdjacencyConfig, AdjacencyType, BinaryMatrix, BoardSize, BoardgenAlgorithm, Cell, Position, GameMode, Vector } from 'src/types/mspp-types';
import { MatrixGeneratorService } from '../core/matrix-generator.service';
import { StateService } from '../core/state.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';


@Component({
  selector: 'mspp-game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameContainerComponent {
  mode: GameMode = GameMode.GAME
  cells: Cell[][] = [];
  boardgenAlgoritm: BoardgenAlgorithm = BoardgenAlgorithm.Zero
  rowCount: number = 10;
  colCount: number = 10;
  mineDensity: number = 10;
  selectedAdjacencyType = AdjacencyType.Standard;
  adjacencies = AdjacencyConfig[this.selectedAdjacencyType];
  boardSize: BoardSize | null = null

  thresholdForLoadingInf = 70
  cellsToLoadInf = 30

  private scrollSubject$ = new Subject<number>();

  //expose to template
  GameMode = GameMode

  constructor(private matrixGeneratorService: MatrixGeneratorService,
    private cdr: ChangeDetectorRef,
    private stateService: StateService,) { }

  ngOnInit(): void {
    this.stateService.mode$.subscribe((newMode: GameMode) => {
      this.mode = newMode;
    });

    this.stateService.adjacencies$.subscribe((adjs: Vector[]) => {
      this.adjacencies = adjs
    });

    this.stateService.boardgenAlgorithm$.subscribe((alg: BoardgenAlgorithm) => {
      this.boardgenAlgoritm = alg
    })

    this.stateService.mineDensity$.subscribe((density: number) => {
      this.mineDensity = density
    })

    this.stateService.boardSize$.subscribe((size: BoardSize) => {
      this.setRowsAndColumns(size)
      this.boardSize = size
    })

    this.scrollSubject$.pipe(
      debounceTime(100) 
    ).subscribe((event: number) => {
      this.debouncedHandleScroll(event);
    });

  }

  private setRowsAndColumns(boardSize: BoardSize): void {
    switch (boardSize) {
      case BoardSize.Small:
        this.rowCount = 9;
        this.colCount = 9;
        break;
      case BoardSize.Medium:
        this.rowCount = 16;
        this.colCount = 16;
        break;
      case BoardSize.Large:
        this.rowCount = 16;
        this.colCount = 30;
        break;
      case BoardSize.Massive:
        this.rowCount = 1000;
        this.colCount = Math.floor(window.innerWidth / 20) - 8;
        break;
      case BoardSize.Infinite:
        const cellWidth = 20;
        const cellHeight = 20;
        this.colCount = Math.floor(window.innerWidth / cellWidth) - 16; //this, I recognize, is kind of sloppy
        this.rowCount = Math.floor(window.innerHeight / cellHeight) + this.cellsToLoadInf;
        break;
    }
  }

  handleScroll(event: any): void {
    this.scrollSubject$.next(event);
  }

  private debouncedHandleScroll(event: any): void {
    if (this.boardSize === BoardSize.Infinite) {
      const totalItems = this.cells.length;

      if (totalItems - event <= this.thresholdForLoadingInf) {
        this.addMoreRows(this.cellsToLoadInf);
      }
    }
  }

  addMoreRows(numRows: number): void {
  const lastOldRowIndex = this.cells.length - 1;
  const newCells = this.cells.concat(this.getCells(this.getMatrix(numRows, this.colCount, this.mineDensity)));

  // Recalculate adjacency for these rows since we combined two boards
  this.recalculateRowAdjacency(newCells, lastOldRowIndex);
  this.recalculateRowAdjacency(newCells, lastOldRowIndex + 1);

  this.revealAdjacentIfNeeded(newCells, lastOldRowIndex)
  
  // Update cells and force change detection
  this.cells = newCells;
  this.cdr.detectChanges();
}

private revealAdjacentIfNeeded(newCells: Cell[][], lastOldRowIndex: number): void {
  const cellsToReveal: Position[] = [];

  // Populate the array with positions of cells
  for (let colIndex = 0; colIndex < newCells[lastOldRowIndex].length; colIndex++) {
    const cell = newCells[lastOldRowIndex][colIndex];
    if (!cell.isMine && cell.isRevealed && cell.adjacentMines === 0) {
      for (const { x, y } of this.adjacencies) {
        const newRow = lastOldRowIndex + x;
        const newCol = colIndex + y;
        // Ensure the adjacent cell is within bounds
        if (newRow >= 0 && newRow < newCells.length && newCol >= 0 && newCol < newCells[0].length) {
          // Add position to the array
          cellsToReveal.push({ row: newRow, col: newCol });
        }
      }
    }
  }

  // Now reveal each cell that has been flagged for reveal
  cellsToReveal.forEach(position => {
    this.revealCell(newCells, position.row, position.col);
  });
}



  recalculateRowAdjacency(cells: Cell[][], rowIndex: number): void {
    const row = cells[rowIndex];
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      cells[rowIndex][colIndex].adjacentMines = this.countAdjacentMines(rowIndex, colIndex, cells);
    }
  }


  handleCellClickedEvent(event: Position): void {
    const cell = this.cells[event.row][event.col];
    if (!cell.isMarked) {

      if (cell.isMine) {
        alert("Game Over: You clicked on a mine!");
        cell.isRevealed = true
        return;
      } else {
        this.revealCell(this.cells, event.row, event.col)
      }
    }
  }

  revealCell(cells: Cell[][], row: number, column: number): void {
    const stack: { row: number, col: number }[] = [{ row, col: column }];
    while (stack.length > 0) {
      const { row, col } = stack.pop()!;

      if (!(cells[row][col].isRevealed || cells[row][col].isMarked)) {
        cells[row][col].isRevealed = true;

        if (cells[row][col].adjacentMines === 0) {
          for (const { x, y } of this.adjacencies) {
            const newRow = row + x;
            const newCol = col + y;

            if (newRow >= 0 && newRow < cells.length && newCol >= 0 && newCol < cells[0].length) {
              stack.push({ row: newRow, col: newCol });
            }
          }
        }
      }
    }
  }

  handleCellRightClickedEvent(event: Position): void {
    const cell = this.cells[event.row][event.col];
    if (!cell.isRevealed) {
      cell.isMarked = !cell.isMarked;
    }
  }

  startGame(): void {
    this.cells = this.getCells(this.getMatrix(this.rowCount, this.colCount, this.mineDensity))
  }

  getMatrix(rows: number, columns: number, mineDensity: number): BinaryMatrix {
    const mines = this.getNumMines(rows, columns, mineDensity)
    switch (this.boardgenAlgoritm) {
      case BoardgenAlgorithm.Zero:
        return this.matrixGeneratorService.getZeroMatrix(rows, columns);
      case BoardgenAlgorithm.Unstructured:
        return this.matrixGeneratorService.getUnstructuredMatrix(rows, columns, mines);
      case BoardgenAlgorithm.HoleEveryThree:
        return this.matrixGeneratorService.getUnstructuredMatrixWithHoles(rows, columns, mines, 3);
      case BoardgenAlgorithm.GaussianBlur:
        return this.matrixGeneratorService.getBlurredUnstructuredMatrix(rows, columns, mines);
      case BoardgenAlgorithm.TripleGaussianBlur:
        return this.matrixGeneratorService.getBlurredUnstructuredMatrix(rows, columns, mines, 3);
      case BoardgenAlgorithm.GaussianBlurWithUnstructured:
        return this.matrixGeneratorService.getUnstructuredMatrixWithGaussianClusters(rows, columns, mines);
      case BoardgenAlgorithm.Perlin:
        return this.matrixGeneratorService.getPerlinMatrix(rows, columns, mines);
      case BoardgenAlgorithm.Simplex:
        return this.matrixGeneratorService.getSimplexMatrix(rows, columns, mines);
      case BoardgenAlgorithm.UnstructuredWithSimplex:
        return this.matrixGeneratorService.getUnstructuredMatrixWithSimplexClusters(rows, columns, mines);
    }
  }

  private getNumMines(rows: number, cols: number, mineDensity: number) {
    return Math.round(rows * cols * (mineDensity / 100))
  }

  //note: I don't love doing this in two stages, because I don't like creating data in a state that is semi-correct.
  // however, this will make things much less ugly when we do inf scroll
  getCells(matrix: BinaryMatrix): Cell[][] {
    const cellMatrix = matrix.map((row, rowIndex) => {
      return row.map((element, colIndex) => {
        return {
          isMine: element === 1,
          isRevealed: false,
          isMarked: false,
          adjacentMines: 0  // Initialize with 0, will populate this later
        };
      });
    });

    for (let rowIndex = 0; rowIndex < cellMatrix.length; rowIndex++) {
      for (let colIndex = 0; colIndex < cellMatrix[rowIndex].length; colIndex++) {
        cellMatrix[rowIndex][colIndex].adjacentMines = this.countAdjacentMines(rowIndex, colIndex, cellMatrix);
      }
    }

    return cellMatrix;
  }


  private countAdjacentMines(rowIndex: number, colIndex: number, matrix: Cell[][]): number {
    let adjacentMines = 0;
    for (const { x, y } of this.adjacencies) {
      const newRow = rowIndex + x;
      const newCol = colIndex + y;
      if (newRow >= 0 && newRow < matrix.length && newCol >= 0 && newCol < matrix[0].length) {
        if (matrix[newRow][newCol].isMine) {
          adjacentMines++;
        }
      }
    }
    return adjacentMines;
  }

}
