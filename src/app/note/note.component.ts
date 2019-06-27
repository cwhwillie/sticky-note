import { Component, Input, Output, ViewChild, ElementRef, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { concatAll, map, takeUntil, withLatestFrom, take } from 'rxjs/operators';

import { Note } from '../note';
import { NoteDataService } from '../note-data.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() note: Note;
  @Input() isCreate: boolean;
  @Input() isContentFocus: boolean;

  @ViewChild('myNote') myNote: ElementRef;
  @ViewChild('noteHeader') noteHeader: ElementRef;
  @ViewChild('noteContent') noteContent: ElementRef;
  @ViewChild('noteColor') noteColor: ElementRef;

  @Output() newNoteHide = new EventEmitter();

  id: number;
  isReadonly: boolean;
  title: string;
  content: string;
  color: string;
  z: number;

  private subscription: Subscription;

  constructor(private noteService: NoteDataService) { }

  ngOnInit() {
    this.isReadonly = true;
    this.myNote.nativeElement.style.left = this.isCreate ? '0px' : this.note.x + 'px';
    this.myNote.nativeElement.style.top = this.isCreate ? '0px' : this.note.y + 'px';
    this.reset();
    this.subscription = new Subscription();
  }

  reset() {
    this.id = this.isCreate ? -1 : this.note.id;
    this.title = this.isCreate ? '' : this.note.title;
    this.content = this.isCreate ? '' : this.note.content;
    this.color = this.isCreate ? '#C9FFFF' : this.note.color;
    this.z = this.noteService.updateOrder(this.id);
  }

  ngAfterViewInit() {
    const mouseDown = fromEvent(this.noteHeader.nativeElement, 'mousedown');
    const mouseUp = fromEvent(document.getElementById('noteBoard'), 'mouseup');
    const mouseMove = fromEvent(document.getElementById('noteBoard'), 'mousemove');

    this.subscription.add(mouseDown.pipe(
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
      this.myNote.nativeElement.style.left = pos.x + 'px';
      this.myNote.nativeElement.style.top = pos.y + 'px';
      if (!this.isCreate) {
        this.noteService.updatePosition({ id: this.id, x: pos.x, y: pos.y });
      }
    }));

    this.subscription.add(fromEvent(this.noteColor.nativeElement, 'keyup').subscribe(() => {
      if (!this.isCreate) {
        const tmpNote = new Note({
          id: this.id,
          title: this.title,
          content: this.content,
          color: this.color,
          x: this.myNote.nativeElement.offsetLeft,
          y: this.myNote.nativeElement.offsetTop
        });
        this.noteService.save(tmpNote);
      }
    }));

    this.subscription.add(fromEvent(this.myNote.nativeElement, 'focus').subscribe(() => {
      this.myNote.nativeElement.style.zIndex = this.noteService.updateOrder(this.id);
    }));

    this.subscription.add(mouseDown.subscribe(() => {
      if (!this.myNote.nativeElement.id) {
        this.myNote.nativeElement.style.zIndex = this.noteService.updateOrder(this.id);
        this.newNoteHide.emit(this.myNote.nativeElement);
      }
    }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isContentFocus']) {
      this.isReadonly = false;
      setTimeout(() => {
        this.content = '';
        this.title = '';
        this.noteContent.nativeElement.focus();
      }, 0);
    }
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
          color: this.color,
          x: this.myNote.nativeElement.offsetLeft,
          y: this.myNote.nativeElement.offsetTop,
          z: this.myNote.nativeElement.style.zIndex
        });
        this.noteService.save(newNote);
        if (!this.isCreate) {
          this.note = newNote;
        } else {
          this.newNoteHide.emit();
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
    this.subscription.unsubscribe();
  }
}
