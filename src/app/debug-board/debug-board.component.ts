import { Component } from '@angular/core';
import { MatrixGeneratorService } from '../core/matrix-generator.service';
import { Algorithm } from 'src/types/mspp-types';


@Component({
  selector: 'mspp-debug-board',
  templateUrl: './debug-board.component.html',
  styleUrls: ['./debug-board.component.scss']
})
export class DebugBoardComponent {

  minefield: number[][] = [];
  rows: number = 16;
  columns: number = 31;
  mines: number = 99;
  selectedAlgorithm: Algorithm = Algorithm.Zero
  Algorithm = Algorithm //expose to template


  //todo: set seed, set algorithm, button to reload that shows seed
  constructor(private matrixGeneratorService: MatrixGeneratorService) { }

  getBoard() {
    switch (this.selectedAlgorithm) {
      case Algorithm.Zero:
        this.minefield = this.matrixGeneratorService.getZeroMatrix(this.rows,this.columns);
        break;
      case Algorithm.Unstructured:
        this.minefield = this.matrixGeneratorService.getUnstructuredMatrix(this.rows, this.columns, this.mines);
        break;
        case Algorithm.HoleEveryThree:
          this.minefield = this.matrixGeneratorService.getUnstructuredMatrixWithHoles(this.rows, this.columns, this.mines, 3);
          break;
    }
  }

  getAlgorithmEnumKeys(): string[] {
    return Object.keys(Algorithm);
  }
}