import { Component, OnInit } from '@angular/core';
import { StateService } from '../core/state.service';
import { BoardgenAlgorithm, GameMode, AdjacencyType, BoardSize } from 'src/types/mspp-types';

@Component({
  selector: 'mspp-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  // Expose to template
  GameMode = GameMode;
  Algorithm = BoardgenAlgorithm;
  AdjacencyType = AdjacencyType;
  BoardSize = BoardSize;

  constructor(private stateService: StateService) { }

  ngOnInit(): void {
    // Subscribe to the observable to update component state
    this.stateService.mode$.subscribe(mode => {
      this.currentMode = mode;
    });

    this.stateService.selectedAdjacencyType$.subscribe(adjacency => {
      this.selectedAdjacency = adjacency;
    });

    this.stateService.boardgenAlgorithm$.subscribe(alg => {
      this.selectedAlgorithm = alg;
    });

    this.stateService.boardSize$.subscribe(size => {
      this.boardSize = size;
    });
  }

  currentMode: GameMode = GameMode.GAME;
  selectedAlgorithm: BoardgenAlgorithm = BoardgenAlgorithm.Zero;
  selectedAdjacency: AdjacencyType = AdjacencyType.Standard;
  boardSize: BoardSize = BoardSize.Small
  mineDensity: number = 12
  mineDensityError: boolean = false

  selectBoardgenAlgorithm(algorithm: BoardgenAlgorithm): void {
    this.stateService.setBoardgenAlgorithm(algorithm);
  }

  selectAdjacencyType(adjacency: AdjacencyType): void {
    this.stateService.setSelectedAdjacencyType(adjacency);
  }

  selectBoardSize(size: BoardSize): void {
    this.stateService.setBoardSize(size)
  }

  setMineDensity(density: number): void {
    this.stateService.setMineDensity(density)
  }


  validateMineDensity(value: any): void {
    const numericValue = Number(value);
    if (numericValue === null || isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
      this.mineDensityError = true;
    } else {
      this.mineDensityError = false;
      this.setMineDensity(numericValue)
    }
  }
  

  toggleMode(): void {
    const newMode = this.currentMode === GameMode.GAME ? GameMode.DEBUG : GameMode.GAME;
    this.stateService.setMode(newMode);
  }

  getAlgorithmEnumKeys(): string[] {
    return Object.keys(BoardgenAlgorithm);
  }

  getAdjacencyEnumKeys(): string[] {
    return Object.keys(AdjacencyType);
  }

  getBoardSizeEnumKeys(): string[] {
    return Object.keys(BoardSize)
  }
}
