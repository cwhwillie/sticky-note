import { Injectable } from '@angular/core';

import { Note } from './note';

@Injectable()
export class NoteDataService {
  private noteList: Note[] = [];

  constructor() {
    const dataStr = localStorage.getItem('NOTE_LIST');
    this.noteList = dataStr ? JSON.parse(dataStr) : [];
  }

  save(newNote: Note): void {
    const index = this.noteList.findIndex(note => note.id === newNote.id);
    if (index > -1) {
      this.noteList[index] = newNote;
    } else {
      this.noteList.push(newNote);
    }
    localStorage.setItem('NOTE_LIST', JSON.stringify(this.noteList));
  }

  load(): Note[] {
    return this.noteList;
  }

  delete(id: number) {
    this.noteList = this.noteList.filter(note => note.id !== id);
    localStorage.setItem('NOTE_LIST', JSON.stringify(this.noteList));
  }
}
