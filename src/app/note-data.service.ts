import { Injectable } from '@angular/core';

@Injectable()
export class NoteDataService {
  private noteList = [];

  constructor() {
    let dataStr = localStorage.getItem('NOTE_LIST');
    this.noteList = dataStr ? JSON.parse(dataStr) : [];
  }

  saveNote(note): void {
    this.noteList.push(note);
    localStorage.setItem('NOTE_LIST', JSON.stringify(this.noteList));
    return;
  }
}