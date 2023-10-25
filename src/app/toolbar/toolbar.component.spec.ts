import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarComponent } from './toolbar.component';
import { BoardgenAlgorithm, GameMode } from 'src/types/mspp-types';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selected algorithm', () => {
    const selectedAlgorithm = BoardgenAlgorithm.Zero;   
    spyOn(component.algorithmSelected, 'emit');
    
    component.selectBoardgenAlgorithm(selectedAlgorithm);
    
    expect(component.algorithmSelected.emit).toHaveBeenCalledWith(selectedAlgorithm);
  });

  it('should toggle mode between GAME and DEBUG', () => {
    spyOn(component.modeChanged, 'emit');
    
    component.currentMode = GameMode.GAME;
    component.toggleMode();
    
    expect(component.currentMode).toBe(GameMode.DEBUG); 
    expect(component.modeChanged.emit).toHaveBeenCalledWith(GameMode.DEBUG); 
    
    component.toggleMode();
    
    expect(component.currentMode).toBe(GameMode.GAME); 
    expect(component.modeChanged.emit).toHaveBeenCalledWith(GameMode.GAME); 
  });
});
