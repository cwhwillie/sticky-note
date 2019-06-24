import { Injectable } from '@angular/core';

@Injectable()
export class NoteDataService {
  private noteList = [];

  constructor() {
    let dataStr = localStorage.getItem('NOTE_LIST');
    this.noteList = dataStr ? JSON.parse(dataStr) : [];
  }

  saveNote(newNote): void {
    let targetNoteIndex = this.noteList.findIndex(note => note.id === newNote.id);
    if (targetNoteIndex > -1) {
      this.noteList[targetNoteIndex] = newNote;
    } else {
      this.noteList.push(newNote);
    }
    localStorage.setItem('NOTE_LIST', JSON.stringify(this.noteList));
    return;
  }
}
