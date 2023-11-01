export type BinaryMatrix = number[][];

export enum BoardgenAlgorithm {
  Zero = 'Zero',
  Unstructured = 'Unstructured',
  HoleEveryThree = 'HoleEveryThree',
  GaussianBlur = 'GaussianBlur',
  TripleGaussianBlur = 'TripleGaussianBlur',
  GaussianBlurWithUnstructured = 'GaussianBlurWithUnstructured',
  Perlin = 'Perlin',
  Simplex = 'Simplex',
  UnstructuredWithSimplex = 'UnstructuredWithSimplex'
}

export enum AdjacencyType {
  Standard = "Standard",
  NoDiagonal = "NoDiagonal",
}

export const AdjacencyConfig: { [key in AdjacencyType]: Vector[] } = {
  [AdjacencyType.Standard]: [
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 1 },
    { x: 1, y: 1 }, 
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: -1 }
  ],
  [AdjacencyType.NoDiagonal]: [
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 }
  ]
};

export enum BoardSize {
  Small = "Small",
  Medium = "Medium",
  Large = "Large",
  Massive = "Massive",
  Infinite = "Infinite"
}

export interface Vector {
  x: number,
  y: number
}

export interface Cell {
  isMine: boolean,
  isRevealed: boolean,
  isMarked: boolean,
  adjacentMines: number
}

export enum GameMode {
  GAME = 'game',
  DEBUG = 'debug'
}

export interface CellEvent {
  row: number;
  col: number;
}
