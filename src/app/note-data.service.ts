import { Injectable } from '@angular/core';

import { Note } from './note';

@Injectable()
export class NoteDataService {
  private noteList: Note[] = [];

  constructor() {
    const dataStr = localStorage.getItem('NOTE_LIST');
    this.noteList = dataStr ? JSON.parse(dataStr) : [];
  }

  save(note: Note): void {
    this.noteList.push(note);
    localStorage.setItem('NOTE_LIST', JSON.stringify(this.noteList));
    return;
  }

  load(): Note[] {
    return this.noteList;
  }

  delete(id: number) {
    this.noteList = this.noteList.filter(note => note.id !== id);
  }
}
