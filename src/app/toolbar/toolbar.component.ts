import { Component, OnInit } from '@angular/core';
import { StateService } from '../core/state-service.service';
import { BoardgenAlgorithm, GameMode, AdjacencyType } from 'src/types/mspp-types';

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

  constructor(private stateService: StateService) {}

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

    this.stateService.isInfiniteScroll$.subscribe(scroll => {
      this.isInfiniteScroll = scroll;
    });
  }

  currentMode: GameMode = GameMode.GAME;
  selectedAlgorithm: BoardgenAlgorithm = BoardgenAlgorithm.Zero;
  selectedAdjacency: AdjacencyType = AdjacencyType.Standard;
  isInfiniteScroll: boolean = false

  selectBoardgenAlgorithm(algorithm: BoardgenAlgorithm): void {
    this.stateService.setBoardgenAlgorithm(algorithm);
  }

  selectAdjacencyType(adjacency: AdjacencyType): void {
    this.stateService.setSelectedAdjacencyType(adjacency);
  }

  toggleMode(): void {
    const newMode = this.currentMode === GameMode.GAME ? GameMode.DEBUG : GameMode.GAME;
    this.stateService.setMode(newMode);
  }

  toggleInfiniteScroll(): void {
    this.stateService.setInfiniteScroll(!this.isInfiniteScroll)
  }

  getAlgorithmEnumKeys(): string[] {
    return Object.keys(BoardgenAlgorithm);
  }

  getAdjacencyEnumKeys(): string[] {
    return Object.keys(AdjacencyType);
  }
}
