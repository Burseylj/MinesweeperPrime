import { Component, Input } from '@angular/core';
import { MatrixGeneratorService } from '../core/matrix-generator.service';
import { BoardgenAlgorithm, Cell } from 'src/types/mspp-types';


@Component({
  selector: 'mspp-debug-board',
  templateUrl: './debug-board.component.html',
  styleUrls: ['./debug-board.component.scss']
})
export class DebugBoardComponent {

  @Input()
  cells: Cell[][] = []

  minefield: number[][] = [];
  rows: number = 16;
  columns: number = 31;
  mines: number = 99;
  selectedAlgorithm: BoardgenAlgorithm = BoardgenAlgorithm.Zero
  Algorithm = BoardgenAlgorithm //expose to template


  //todo: set seed, set algorithm, button to reload that shows seed
  constructor(private matrixGeneratorService: MatrixGeneratorService) { }

  getAlgorithmEnumKeys(): string[] {
    return Object.keys(BoardgenAlgorithm);
  }
}