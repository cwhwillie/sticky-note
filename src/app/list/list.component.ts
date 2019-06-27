import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Note } from '../note';
import { NoteDataService } from '../note-data.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  noteList: Note[];
  activeNote = -1;

  private subscription: Subscription;

  constructor(private noteService: NoteDataService) { }

  ngOnInit() {
    this.subscription = new Subscription();

    this.subscription.add(this.noteService.update$.subscribe(e => {
      this.noteList = (e as CustomEvent).detail;
    }));

    this.subscription.add(this.noteService.active$.subscribe(e => {
      this.activeNote = (e as CustomEvent).detail;
    }));
  }

  delete(id: number) {
    this.noteService.delete(id);
  }

  active(id: number) {
    this.noteService.active(id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
