import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameContainerComponent } from './game-container.component';

describe('GameContainerComponent', () => {
  let component: GameContainerComponent;
  let fixture: ComponentFixture<GameContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameContainerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should recalculate adjacent mines when rows are added', () => {
    //[0, 1]
    component.cells = [
      [
        { isMine: false, isRevealed: false, isMarked: false, adjacentMines: 0 },
        { isMine: true, isRevealed: false, isMarked: false, adjacentMines: 0 }
      ]
    ];
    component.colCount = 2;
    component.mineDensity = 1;

    spyOn(component, 'getMatrix').and.returnValue([
      [0, 1],
      [0, 0]
    ]);
    spyOn(component, 'getCells').and.callThrough();
    spyOn(component, 'recalculateRowAdjacency').and.callThrough();

    // Add more rows so we get
    //[0, 1]
    //[0, 1]
    //[0, 0]
    component.addMoreRows(2);

    // Validate adjacent mines count
    expect(component.cells[0][0].adjacentMines).toEqual(2);
    expect(component.cells[1][0].adjacentMines).toEqual(2);
    expect(component.cells[2][0].adjacentMines).toEqual(1);
  });

  describe('revealAdjacentCells', () => {

    beforeEach(() => {
      fixture = TestBed.createComponent(GameContainerComponent);
      component = fixture.componentInstance;

      component.cells = [
        [
          { isMine: false, isRevealed: false, isMarked: false, adjacentMines: 1 },
          { isMine: false, isRevealed: false, isMarked: false, adjacentMines: 0 },
        ],
        [
          { isMine: true, isRevealed: false, isMarked: false, adjacentMines: 1 },
          { isMine: false, isRevealed: false, isMarked: false, adjacentMines: 1 },
        ]
      ];

      fixture.detectChanges();
    });

    it('should reveal the cell if it is not already revealed or marked', () => {
      component.revealCell(component.cells, 0, 0);
      expect(component.cells[0][0].isRevealed).toBe(true);
    });

    it('should not reveal the cell if it is already marked', () => {
      component.cells[0][0].isMarked = true;
      component.revealCell(component.cells, 0, 0);
      expect(component.cells[0][0].isRevealed).toBe(false);
    });

    it('should reveal all adjacent cells if the clicked cell has zero adjacent mines', () => {
      component.cells[0][1].adjacentMines = 0;
      component.revealCell(component.cells, 0, 1);
      expect(component.cells[0][0].isRevealed).toBe(true);
      expect(component.cells[1][0].isRevealed).toBe(true);
      expect(component.cells[1][1].isRevealed).toBe(true);
    });

    it('should only reveal the clicked cell if it has adjacent mines', () => {
      component.cells[0][0].adjacentMines = 1;
      component.revealCell(component.cells, 0, 0);
      expect(component.cells[0][0].isRevealed).toBe(true);
      expect(component.cells[0][1].isRevealed).toBe(false);
      expect(component.cells[1][0].isRevealed).toBe(false);
      expect(component.cells[1][1].isRevealed).toBe(false);
    });
  });

});
