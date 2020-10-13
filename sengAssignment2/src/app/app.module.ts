import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GameBoardComponent } from './board/game-board/game-board.component';
import { GameCellComponent } from './board/game-cell/game-cell.component';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    GameCellComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
