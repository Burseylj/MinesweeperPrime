import { Injectable } from '@angular/core';
import { BinaryMatrix } from 'src/types/mspp-types';
import { Noise } from 'noisejs';


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
    const matrix = this.getZeroMatrix(rows, columns);
    return this.placeUnstructuredMines(matrix, mines);
  }

  // unstructured matrix which does not have a cell on every (holeEvery)th cell
  getUnstructuredMatrixWithHoles(rows: number, columns: number, mines: number, holeEvery: number): BinaryMatrix {
    const matrix = this.getZeroMatrix(rows, columns)
    let minesPlaced = 0;

    while (minesPlaced < mines) {
      const rowIndex = Math.floor(Math.random() * rows);
      const colIndex = Math.floor(Math.random() * columns);

      let cellNumber = rowIndex * columns + colIndex
      let cellOrder = cellNumber % holeEvery

      if (matrix[rowIndex][colIndex] === 0 && cellOrder !== 0) {
        matrix[rowIndex][colIndex] = 1;
        minesPlaced++;
      }
    }
    return matrix;
  }

  //gaussian blur applied to unstructured matrix ("censoring" type of blur in visual processing)
  getBlurredUnstructuredMatrix(rows: number, columns: number, mines: number, blurs: number = 1): BinaryMatrix {
    let matrix = this.getUnstructuredMatrix(rows, columns, mines);

    for (let i = 0; i < blurs; i++) {
      matrix = this.applyGaussianBlur(matrix);
    }

    return this.roundTopNValues(matrix, mines);
  }

  // gaussian and unstructured strategies mixed
  getUnstructuredMatrixWithGaussianClusters(rows: number, columns: number, mines: number): BinaryMatrix {
    let clusteredMines = Math.round(mines/2)
    let unstructuredMines = mines - clusteredMines
    let clusterMatrix = this.getBlurredUnstructuredMatrix(rows, columns, clusteredMines);
    return this.placeUnstructuredMines(clusterMatrix, unstructuredMines)
  }

  //perlin noise matrix, more organic looking noise
  getPerlinMatrix(rows: number, columns: number, mines: number): BinaryMatrix {
    return this.roundTopNValues(this.generatePerlinMatrix(rows, columns), mines)
  }

  //simplex noise, more organic noise
  getSimplexMatrix(rows: number, columns: number, mines: number): BinaryMatrix {
    return this.roundTopNValues(this.generateSimplexMatrix(rows, columns), mines)
  }

  //simplex and unstructured strategies mixed
  getUnstructuredMatrixWithSimplexClusters(rows: number, columns: number, mines: number): BinaryMatrix {

    let clusteredMines = Math.round(mines*3/4)
    let unstructuredMines = mines - clusteredMines
    let clusterMatrix = this.getSimplexMatrix(rows, columns, clusteredMines);
    return this.placeUnstructuredMines(clusterMatrix, unstructuredMines)
  }

  private placeUnstructuredMines(matrix: BinaryMatrix, mines: number): BinaryMatrix {
    let minesPlaced = 0;
    const rows = matrix.length;
    const columns = matrix[0].length;

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
  
  gaussian3Kernel = [
    [0.077847, 0.123317, 0.077847],
    [0.123317, 0.195346, 0.123317],
    [0.077847, 0.123317, 0.077847],
  ];

  private applyGaussianBlur(matrix: number[][], kernel: number[][] = this.gaussian3Kernel): number[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;
    

    const output: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

    for (let i = 1; i < rows - 1; i++) {
      for (let j = 1; j < cols - 1; j++) {
        output[i][j] = this.applyConvolution(matrix, i, j, kernel);
      }
    }

    return output;
  }

  private applyConvolution(matrix: number[][], i: number, j: number, kernel: number[][]): number {
    let sum = 0;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        sum += matrix[i + x][j + y] * kernel[x + 1][y + 1];
      }
    }
    return sum;
  }


  private roundTopNValues(matrix: number[][], n: number): BinaryMatrix {
    const rows = matrix.length;
    const cols = matrix[0].length;
  
    const cells: { row: number, col: number, value: number }[] = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        cells.push({ row: i, col: j, value: matrix[i][j] });
      }
    }
  
    cells.sort((a, b) => b.value - a.value);
    const output: BinaryMatrix = Array.from({ length: rows }, () => Array(cols).fill(0));
  
    // Take top N elements and set them to 1 in the output matrix
    for (let i = 0; i < n; i++) {
      const { row, col } = cells[i];
      output[row][col] = 1;
    }
  
    return output;
  }
  
  private countMines(matrix: BinaryMatrix): number {
    let count = 0;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        if (matrix[i][j] === 1) {
          count++;
        }
      }
    }
    return count;
  }

 private generatePerlinMatrix(rows: number, cols: number, scale: number = 0.4): number[][] {
    const noise = new Noise(Math.random());
    const matrix: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const noiseValue = noise.perlin2(i * scale, j * scale);
        matrix[i][j] = noiseValue;
      }
    }
    return matrix;
  }

  private generateSimplexMatrix(rows: number, cols: number, scale: number = 0.2): number[][] {
    const noise = new Noise(Math.random());
    const matrix: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const noiseValue = noise.simplex2(i * scale, j * scale);
        matrix[i][j] = noiseValue;
      }
    }
    return matrix;
  }
}