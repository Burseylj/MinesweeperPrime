import { Component, EventEmitter, Output } from '@angular/core';
import { AdjacencyType, BoardgenAlgorithm, GameMode } from 'src/types/mspp-types';

@Component({
  selector: 'mspp-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Output() algorithmSelected = new EventEmitter<BoardgenAlgorithm>();
  @Output() modeChanged = new EventEmitter<GameMode>();
  @Output() adjacencyChanged = new EventEmitter<AdjacencyType>();

  
  selectedAlgorithm: BoardgenAlgorithm = BoardgenAlgorithm.Zero
  currentMode: GameMode = GameMode.GAME
  selectedAdjacency: AdjacencyType = AdjacencyType.Standard;
  //expose to template
  GameMode = GameMode
  Algorithm = BoardgenAlgorithm
  AdjacencyType = AdjacencyType;

  selectBoardgenAlgorithm(algorithm: BoardgenAlgorithm): void {
    this.algorithmSelected.emit(algorithm);
  }

  selectAdjacencyType(adjacency: AdjacencyType): void {
    this.selectedAdjacency = adjacency;
    this.adjacencyChanged.emit(this.selectedAdjacency);
  }

  toggleMode(): void {
    this.currentMode = this.currentMode === GameMode.GAME ? GameMode.DEBUG : GameMode.GAME;
    this.modeChanged.emit(this.currentMode);
  }

  getAlgorithmEnumKeys(): string[] {
    return Object.keys(BoardgenAlgorithm);
  }
  
  getAdjacencyEnumKeys(): string[] {
    return Object.keys(AdjacencyType);
  }
}
