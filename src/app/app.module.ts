import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DebugBoardComponent } from './debug-board/debug-board.component';
import { FormsModule } from '@angular/forms';
import { GameBoardComponent } from './game-board/game-board.component';
import { GameContainerComponent } from './game-container/game-container.component';
import { ToolbarComponent } from './toolbar/toolbar.component';



@NgModule({
  declarations: [
    AppComponent,
    DebugBoardComponent,
    GameBoardComponent,
    GameContainerComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
