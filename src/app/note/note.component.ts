import { Component, OnInit, Input } from '@angular/core';

import { Note } from '../note';
import { NoteDataService } from '../note-data.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  @Input() note: Note;
  isCreate: boolean;
  title: string;
  content: string;
  color: string;
  isReadonly = true;

  constructor(private noteService: NoteDataService) { }

  ngOnInit() {
    this.isCreate = this.note == null;
    this.reset();
  }

  reset() {
    this.title = this.isCreate ? '' : this.note.title;
    this.content = this.isCreate ? '' : this.note.content;
    this.color = this.isCreate ? '' : this.note.color;
  }

  onKeydown(event: KeyboardEvent) {
    if (this.isReadonly) {
      return;
    }
    switch (event.code) {
      case 'Enter':
        if (event.shiftKey) {
          return;
        }
        const newNote = new Note({
          title: this.title,
          content: this.content,
          color: this.color
        });
        this.noteService.save(newNote);
        if (!this.isCreate) {
          this.note = newNote;
        }
        this.reset();
        this.turnOffEditMode();
        break;
      case 'Escape':
        this.reset();
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
