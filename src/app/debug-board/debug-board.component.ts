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

  //todo: set seed, set algorithm, button to reload that shows seed
  constructor(private matrixGeneratorService: MatrixGeneratorService) { }

  getAlgorithmEnumKeys(): string[] {
    return Object.keys(BoardgenAlgorithm);
  }
}