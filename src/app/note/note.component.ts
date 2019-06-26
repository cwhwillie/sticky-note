import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { concatAll, map, takeUntil, withLatestFrom } from 'rxjs/operators';

import { Note } from '../note';
import { NoteDataService } from '../note-data.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit, AfterViewInit {
  @Input() note: Note;
  @Input() isCreate: boolean;
  @ViewChild('myNote') myNote: ElementRef;
  @ViewChild('noteHeader') noteHeader: ElementRef;
  id: number;
  isReadonly: boolean;
  title: string;
  content: string;
  color: string;

  private noteMoveSubscription: Subscription;

  constructor(private noteService: NoteDataService) { }

  ngOnInit() {
    this.isReadonly = true;
    this.reset();
  }

  reset() {
    this.id = this.isCreate ? -1 : this.note.id;
    this.title = this.isCreate ? '' : this.note.title;
    this.content = this.isCreate ? '' : this.note.content;
    this.color = this.isCreate ? '' : this.note.color;
  }

  ngAfterViewInit() {
    const mouseDown = fromEvent(this.noteHeader.nativeElement, 'mousedown');
    const mouseUp = fromEvent(document.getElementById('noteBoard'), 'mouseup');
    const mouseMove = fromEvent(document.getElementById('noteBoard'), 'mousemove');

    this.noteMoveSubscription = mouseDown.pipe(
      map((event: MouseEvent) => {
        return mouseMove.pipe(takeUntil(mouseUp));
      }),
      concatAll(),
      withLatestFrom(mouseDown, (move: MouseEvent, down: MouseEvent) => {
        return {
          x: move.clientX - down.offsetX,
          y: move.clientY - down.offsetY,
        };
      })
    )
      .subscribe(pos => {
        /* this.myNote.nativeElement.style.zIndex += NOTES.length; */
        this.myNote.nativeElement.style.left = pos.x + 'px';
        this.myNote.nativeElement.style.top = pos.y + 'px';
      });
  }

  onKeydown(event: KeyboardEvent) {
    if (this.isReadonly) {
      return;
    }
    switch (event.code) {
      case 'Enter':
        if (event.shiftKey) {
          return;
        }
        const newNote = new Note({
          id: this.isCreate ? -1 : this.id,
          title: this.title,
          content: this.content,
          color: this.color
        });
        this.noteService.save(newNote);
        if (!this.isCreate) {
          this.note = newNote;
        } else {
          this.reset();
        }
        this.turnOffEditMode();
        break;
      case 'Escape':
        this.reset();
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
