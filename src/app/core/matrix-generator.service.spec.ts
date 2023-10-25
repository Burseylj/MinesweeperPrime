import { TestBed } from '@angular/core/testing';

import { MatrixGeneratorService } from './matrix-generator.service';
import { BinaryMatrix } from 'src/types/mspp-types';

describe('MatrixGeneratorService', () => {
  let service: MatrixGeneratorService;

  let randomTestsToRun = 50;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatrixGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a zero matrix', () => {
    const rows = 3;
    const columns = 4;
    const zeroMatrix = service.getZeroMatrix(rows, columns);

    expectOnes(zeroMatrix, 0);
    expectRows(zeroMatrix, rows)
    expectColumns(zeroMatrix, columns)
  });

  it('should generate an unstructured matrix', () => {
    for (let index = 0; index < randomTestsToRun; index++) {
      const rows = 5;
      const columns = 10;
      const expectedOnes = 15;
      const unstructuredMatrix = service.getUnstructuredMatrix(rows, columns, expectedOnes);

      expectOnes(unstructuredMatrix, expectedOnes);
      expectRows(unstructuredMatrix, rows)
      expectColumns(unstructuredMatrix, columns)
    }
  });

  it('should generate an unstructured matrix with holes', () => {
    for (let index = 0; index < randomTestsToRun; index++) {
      const rows = 5;
      const columns = 10;
      const expectedOnes = 15;
      const unstructuredMatrix = service.getUnstructuredMatrixWithHoles(rows, columns, expectedOnes, 3);

      expectOnes(unstructuredMatrix, expectedOnes);
      expectRows(unstructuredMatrix, rows)
      expectColumns(unstructuredMatrix, columns)
    }
  });

  it('should generate a gaussian blurred matrix', () => {
    for (let index = 0; index < randomTestsToRun; index++) {
      const rows = 5;
      const columns = 10;
      const expectedOnes = 15;
      const blurredMatrix = service.getBlurredUnstructuredMatrix(rows, columns, expectedOnes, 2);

      expectOnes(blurredMatrix, expectedOnes);
      expectRows(blurredMatrix, rows)
      expectColumns(blurredMatrix, columns)
    }
  });

  

  it('should generate an unstructured gaussian clustered matrix', () => {
    for (let index = 0; index < randomTestsToRun; index++) {
      const rows = 5;
      const columns = 10;
      const expectedOnes = 15;
      const blurredMatrix = service.getUnstructuredMatrixWithGaussianClusters(rows, columns, expectedOnes);

      expectOnes(blurredMatrix, expectedOnes);
      expectRows(blurredMatrix, rows)
      expectColumns(blurredMatrix, columns)
    }
  });

  function expectOnes(matrix: BinaryMatrix, expectedOnes: number): void {
    let count = 0;
    matrix.forEach(row => {
      row.forEach(element => {
        if (element !== 0) {
          count++;
        }
      });
    });
    expect(count).toEqual(expectedOnes);
  }

  function expectRows(matrix: BinaryMatrix, expectedRows: number): void {
    // Use Jasmine's `expect` to create assertions
    expect(matrix.length).toEqual(expectedRows);
  }

  function expectColumns(matrix: BinaryMatrix, expectedColumns: number): void {
    matrix.forEach(row => {
      expect(row.length).toEqual(expectedColumns);
    });
  }

});
