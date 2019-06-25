import { Component, OnInit } from '@angular/core';
import { AfterViewInit, OnDestroy } from '@angular/core';
import { ElementRef, ViewChild} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { noComponentFactoryError } from '@angular/core/src/linker/component_factory_resolver'

import { Note } from '../note';
import { NOTES } from '../mock-notes';

import { Note } from '../note';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('noteBoard') noteBoard: ElementRef;

  private mouseClick$: any;
  private mouseClickSubscription: Subscription;
  private newNote: Note;
  private notes = NOTES;
  private bNewNoteShow: boolean;

  constructor() {}

  ngOnInit() {
    this.newNoteReset();
  }

  newNoteReset() {
    this.newNote = {
      summary: '',
      content: '',
      color: '#C9FFFF',
      x: 20,
      y: 20,
      z: 1
    };
    this.bNewNoteShow = false;
  }

  ngAfterViewInit() {
    this.mouseClick$ = fromEvent(this.noteBoard.nativeElement, 'click');
    this.mouseClickSubscription = this.mouseClick$.subscribe((evt: MouseEvent) => {
      if (evt.target == evt.currentTarget) {
        this.newNote.x = evt.clientX;
        this.newNote.y = evt.clientY;
        this.newNote.z = this.notes.length + 1;
        this.bNewNoteShow = true;
      }
    });
  }

  ngOnDestroy() {
    this.mouseClickSubscription.unsubscribe();
  }
}
