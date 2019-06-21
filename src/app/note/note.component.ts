import { Component, OnInit } from '@angular/core';

import { NoteDataService } from '../note-data.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  originNote = {
    summary: 'test',
    content: 'hello world',
    color: '#ffffff'
  };
  note = {
    summary: this.originNote.summary,
    content: this.originNote.content,
    color: this.originNote.color
  };
  isReadonly = true;

  constructor(private noteService: NoteDataService) { }

  ngOnInit() {
  }

  onKeypress(event) {
    if (this.isReadonly) {
      return;
    }
    switch (event.code) {
      case 'Enter':
        if (event.shiftKey) {
          return;
        }
        this.noteService.saveNote(this.note);
        this.turnOffEditMode();
        break;
      case 'Escape':
        this.note = {
          summary: this.originNote.summary,
          content: this.originNote.content,
          color: this.originNote.color
        };
        this.turnOffEditMode();
        break;
      default:
        break;
    }
  }

  turnOnEditMode() {
    this.isReadonly = false;
  }

  turnOffEditMode() {
    this.isReadonly = true;
  }
}