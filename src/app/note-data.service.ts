import { Injectable } from '@angular/core';

import { Observable, fromEvent } from 'rxjs';

import { Note } from './note';

@Injectable()
export class NoteDataService {
  private noteList: Note[] = [];
  update$: Observable<Event>;
  private noteNum: number;
  active$: Observable<Event>;

  constructor() {
    const dataStr = localStorage.getItem('NOTE_LIST');
    this.noteList = dataStr ? JSON.parse(dataStr) : [];
    this.update$ = fromEvent(document, 'note.update');
    this.noteNum = parseInt(localStorage.getItem('NOTE_SERIAL') || '0', 10);
    this.active$ = fromEvent(document, 'active.update');
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

  updatePosition(detail): void {
    const index = this.noteList.findIndex(note => note.id === detail.id);
    this.noteList[index].x = detail.x;
    this.noteList[index].y = detail.y;
    localStorage.setItem('NOTE_LIST', JSON.stringify(this.noteList));
  }

  active(id: number) {
    const index = this.noteList.findIndex(note => note.id === id);
    if (this.noteList[index].z === this.noteNum - 1) {
      return this.noteList[index].z;
    }
    this.noteList.forEach((note) => {
      if (note.z > this.noteList[index].z) {
        note.z -= 1;
      }
    });
    this.noteList[index].z = this.noteNum - 1;
    this.update();

    document.dispatchEvent(new CustomEvent('active.update', {detail: id}));

    return this.noteList[index].z;
  }

  getNoteNum() {
    return this.noteNum;
  }
}
