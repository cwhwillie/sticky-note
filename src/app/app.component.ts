import { Component, AfterViewInit } from '@angular/core';

import { NoteDataService } from './note-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  constructor(private noteService: NoteDataService) { }

  ngAfterViewInit() {
    this.noteService.update();
  }
}
