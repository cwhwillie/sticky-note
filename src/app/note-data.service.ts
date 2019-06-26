import { Injectable } from '@angular/core';

import { Observable, fromEvent } from 'rxjs';

import { Note } from './note';

@Injectable()
export class NoteDataService {
  private noteList: Note[] = [];
  update$: Observable<Event>;

  constructor() {
    const dataStr = localStorage.getItem('NOTE_LIST');
    this.noteList = dataStr ? JSON.parse(dataStr) : [];
    this.update$ = fromEvent(document, 'note.update');
  }

  save(newNote: Note): void {
    const index = this.noteList.findIndex(note => note.id === newNote.id);
    if (index > -1) {
      this.noteList[index] = newNote;
    } else {
      this.noteList.push(newNote);
    }
    this.update();
  }

  load(): Note[] {
    return this.noteList;
  }

  delete(id: number) {
    this.noteList = this.noteList.filter(note => note.id !== id);
    this.update();
  }

  private update() {
    localStorage.setItem('NOTE_LIST', JSON.stringify(this.noteList));
    document.dispatchEvent(new Event('note.update'));
  }
}
