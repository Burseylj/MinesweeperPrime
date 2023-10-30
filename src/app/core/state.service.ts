import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AdjacencyConfig, AdjacencyType, BoardgenAlgorithm, GameMode, Vector } from 'src/types/mspp-types';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly _mode = new BehaviorSubject<GameMode>(GameMode.GAME);
  readonly mode$ = this._mode.asObservable();

  private readonly _boardgenAlgorithm = new BehaviorSubject<BoardgenAlgorithm>(BoardgenAlgorithm.Zero);
  readonly boardgenAlgorithm$ = this._boardgenAlgorithm.asObservable();

  private readonly _selectedAdjacencyType = new BehaviorSubject<AdjacencyType>(AdjacencyType.Standard);
  readonly selectedAdjacencyType$ = this._selectedAdjacencyType.asObservable();

  private readonly _adjacencies = new BehaviorSubject<Vector[]>(AdjacencyConfig[AdjacencyType.Standard]);
  readonly adjacencies$ = this._adjacencies.asObservable();

  private readonly _isInfiniteScroll = new BehaviorSubject<boolean>(false);
  readonly isInfiniteScroll$ = this._isInfiniteScroll.asObservable();


  setMode(newMode: GameMode): void {
    this._mode.next(newMode);
  }

  setBoardgenAlgorithm(newAlgorithm: BoardgenAlgorithm): void {
    this._boardgenAlgorithm.next(newAlgorithm);
  }

  setSelectedAdjacencyType(newAdjacencyType: AdjacencyType): void {
    this._selectedAdjacencyType.next(newAdjacencyType);
    this._adjacencies.next(AdjacencyConfig[newAdjacencyType]);
  }

  setInfiniteScroll(isInfiniteScroll: boolean): void {
    this._isInfiniteScroll.next(isInfiniteScroll);
  }

}