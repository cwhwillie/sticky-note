import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { NoteComponent } from './note/note.component';
import { NoteDataService } from './note-data.service';
import { BoardComponent } from './board/board.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, ListComponent, NoteComponent, BoardComponent],
  bootstrap: [AppComponent],
  providers: [NoteDataService]
})
export class AppModule { }
