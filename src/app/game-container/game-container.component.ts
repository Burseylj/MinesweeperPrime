import { ChangeDetectorRef, Component } from '@angular/core';
import { AdjacencyConfig, AdjacencyType, BinaryMatrix, BoardSize, BoardgenAlgorithm, Cell, CellEvent, GameMode, Vector } from 'src/types/mspp-types';
import { MatrixGeneratorService } from '../core/matrix-generator.service';
import { StateService } from '../core/state.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'mspp-game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.scss']
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


  thresholdForLoadingInf = 50
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
      debounceTime(300) // time in milliseconds
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

  private addMoreRows(numRows: number): void {
    const newCells = this.getCells(this.getMatrix(numRows, this.colCount, this.mineDensity));
    this.cells = this.cells.concat(newCells);
  }

  handleCellClickedEvent(event: CellEvent): void {
    const cell = this.cells[event.row][event.col];
    if (!cell.isMarked) {

      if (cell.isMine) {
        alert("Game Over: You clicked on a mine!");
        cell.isRevealed = true
        return;
      } else {

        this.revealAdjacentCells(event.row, event.col)
      }
    }
  }

  private revealAdjacentCells(row: number, column: number): void {
    const stack: { row: number, col: number }[] = [{ row, col: column }];
    while (stack.length > 0) {
      const { row, col } = stack.pop()!;

      if (!(this.cells[row][col].isRevealed || this.cells[row][col].isMarked)) {
        this.cells[row][col].isRevealed = true;

        if (this.cells[row][col].adjacentMines === 0) {
          for (const { x, y } of this.adjacencies) {
            const newRow = row + x;
            const newCol = col + y;

            if (newRow >= 0 && newRow < this.cells.length && newCol >= 0 && newCol < this.cells[0].length) {
              stack.push({ row: newRow, col: newCol });
            }
          }
        }
      }
    }
  }

  handleCellRightClickedEvent(event: CellEvent): void {
    const cell = this.cells[event.row][event.col];
    if (!cell.isRevealed) {
      cell.isMarked = !cell.isMarked;
    }
  }

  startGame(): void {
    this.cells = this.getCells(this.getMatrix(this.rowCount, this.colCount, this.mineDensity))
    this.cdr.detectChanges()
  }

  private getMatrix(rows: number, columns: number, mineDensity: number): BinaryMatrix {
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
