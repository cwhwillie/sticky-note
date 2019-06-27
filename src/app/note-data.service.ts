import { Injectable } from '@angular/core';

import { Observable, fromEvent } from 'rxjs';

import { Note } from './note';

@Injectable()
export class NoteDataService {
  private static maxZ = 9999999;
  private noteList: Note[] = [];
  update$: Observable<Event>;
  active$: Observable<Event>;

  constructor() {
    const dataStr = localStorage.getItem('NOTE_LIST');
    this.noteList = dataStr ? JSON.parse(dataStr) : [];
    this.update$ = fromEvent(document, 'note.update');
    this.active$ = fromEvent(document, 'active.update');
  }

  save(newNote: Note): void {
    newNote.z = NoteDataService.maxZ;
    const index = this.noteList.findIndex(note => note.id === newNote.id);
    if (index > -1) {
      this.noteList[index] = newNote;
    } else {
      this.noteList.push(newNote);
    }
    this.noteList.slice().sort((a, b) => a.z - b.z).map((note, i) => note.z = i);
    this.update();
  }

  load(): Note[] {
    return this.noteList;
  }

  delete(id: number) {
    this.noteList = this.noteList.filter(note => note.id !== id);
    this.update();
  }

  update() {
    localStorage.setItem('NOTE_LIST', JSON.stringify(this.noteList));
    document.dispatchEvent(new CustomEvent('note.update', {detail: this.noteList}));
  }

  updatePosition(detail): void {
    const index = this.noteList.findIndex(note => note.id === detail.id);
    this.noteList[index].x = detail.x;
    this.noteList[index].y = detail.y;
    localStorage.setItem('NOTE_LIST', JSON.stringify(this.noteList));
  }

  active(id?: number) {
    const notes = this.noteList.filter(note => note.id === id);

    if (notes.length !== 1) {
      document.dispatchEvent(new CustomEvent('active.update', {detail: -1}));
      return;
    }

    notes.map(note => note.z = NoteDataService.maxZ);

    this.noteList.slice().sort((a, b) => a.z - b.z).map((note, i) => note.z = i);
    this.update();

    document.dispatchEvent(new CustomEvent('active.update', {detail: id}));
  }
}
