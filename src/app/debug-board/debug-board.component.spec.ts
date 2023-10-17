import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugBoardComponent } from './debug-board.component';

describe('DebugBoardComponent', () => {
  let component: DebugBoardComponent;
  let fixture: ComponentFixture<DebugBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebugBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
