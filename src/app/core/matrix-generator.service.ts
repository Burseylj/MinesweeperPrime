import { Injectable } from '@angular/core';
import { BinaryMatrix } from 'src/types/mspp-types';

@Injectable({
  providedIn: 'root',
})
export class MatrixGeneratorService {
  constructor() { }

  getZeroMatrix(rows: number, columns: number): BinaryMatrix {
    return Array.from({ length: rows }, () => Array(columns).fill(0));
  }

  // unstructured matrix, that is, a purely random binary matrix 
  getUnstructuredMatrix(rows: number, columns: number, mines: number): BinaryMatrix {
    const matrix = this.getZeroMatrix(rows, columns)
    let minesPlaced = 0;

    while (minesPlaced < mines) {
      const rowIndex = Math.floor(Math.random() * rows);
      const colIndex = Math.floor(Math.random() * columns);

      if (matrix[rowIndex][colIndex] === 0) {
        matrix[rowIndex][colIndex] = 1;
        minesPlaced++;
      }
    }

    return matrix;
  }

  // unstructured matrix which does not have a cell on every (holeEvery)th cell
  getUnstructuredMatrixWithHoles(rows: number, columns: number, mines: number, holeEvery: number ): BinaryMatrix {
    const matrix = this.getZeroMatrix(rows, columns)
    let minesPlaced = 0;

    while (minesPlaced < mines) {
      const rowIndex = Math.floor(Math.random() * rows);
      const colIndex = Math.floor(Math.random() * columns);

      let cellNumber = rowIndex*columns + colIndex
      let cellOrder = cellNumber % holeEvery

      if (matrix[rowIndex][colIndex] === 0 && cellOrder !== 0 ) {
        matrix[rowIndex][colIndex] = 1;
        minesPlaced++;
      }
    }
    return matrix;
  }
}
