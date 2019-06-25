import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { concatAll, map, takeUntil, withLatestFrom } from 'rxjs/operators';

import { NoteDataService } from '../note-data.service';
import { Note } from '../note';
import { NOTES } from '../mock-notes'

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('note') note: Note;
  @ViewChild('myNote') myNote: ElementRef;

  private noteMoveSubscription: Subscription;

  originNote = {
    summary: 'test',
    content: 'hello world',
    color: '#ffffff'
  };
  /*
  note = {
    summary: this.originNote.summary,
    content: this.originNote.content,
    color: this.originNote.color
  };*/
  isReadonly = true;

  constructor(private noteService: NoteDataService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const mouseDown = fromEvent(this.myNote.nativeElement, 'mousedown');
    const mouseUp = fromEvent(document.body, 'mouseup');
    const mouseMove = fromEvent(document.body, 'mousemove');

    this.noteMoveSubscription = mouseDown.pipe(
      map((event: MouseEvent) => {
        return mouseMove.pipe(takeUntil(mouseUp))
      }),
      concatAll(),
      withLatestFrom(mouseDown, (move: MouseEvent, down: MouseEvent) => {
        return {
          x: move.clientX - down.offsetX,
          y: move.clientY - down.offsetY,
        }
      })
    )
    .subscribe(pos => {
      this.myNote.nativeElement.style.zIndex += NOTES.length;
      this.myNote.nativeElement.style.left = pos.x + "px";
      this.myNote.nativeElement.style.top = pos.y + "px";
    });
  }

  onKeypress(event) {
    if (this.isReadonly) {
      return;
    }
    switch (event.code) {
      case 'Enter':
      if (event.shiftKey) {
          return;
        }
        this.noteService.saveNote(this.note);
        this.turnOffEditMode();
        break;
      case 'Escape':
        this.note = {
          summary: this.originNote.summary,
          content: this.originNote.content,
          color: this.originNote.color
        };
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

  OnDestroy() {
    this.noteMoveSubscription.unsubscribe();
  }
}