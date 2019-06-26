import { Component, OnInit } from '@angular/core';

import { Note } from '../note';
import { NoteDataService } from '../note-data.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  noteList: Note[];
  activeNote = -1;

  constructor(private noteService: NoteDataService) { }

  ngOnInit() {
    this.noteService.update$.subscribe(() => {
      this.update();
    });
    this.update();
  }

  update() {
    this.noteList = this.noteService.load();
  }

  delete(id: number) {
    this.noteService.delete(id);
  }

  active(id: number) {
    this.activeNote = id;
  }
}
