import {
  Component, Input, ViewChild, ElementRef, SimpleChanges,
  OnInit, OnDestroy, AfterViewInit, OnChanges
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

import { Note } from '../note';
import { NoteDataService } from '../note-data.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  private srcNote: Note;
  @Input() set note(note: Note) {
    this.srcNote = note;
  }
  @Input() isCreate: boolean;
  @Input() isOpen: boolean;

  @ViewChild('myNote') myNote: ElementRef;
  @ViewChild('noteHeader') noteHeader: ElementRef;
  @ViewChild('noteTitle') noteTitle: ElementRef;
  @ViewChild('noteContent') noteContent: ElementRef;
  @ViewChild('noteColor') noteColor: ElementRef;

  isReadonly: boolean;
  title: string;
  content: string;
  color: string;

  private subscription: Subscription;

  constructor(private noteService: NoteDataService) { }

  ngOnInit() {
    this.subscription = new Subscription();

    this.reset();
  }

  reset() {
    this.title = this.isCreate ? '' : this.srcNote.title;
    this.content = this.isCreate ? '' : this.srcNote.content;
    this.color = this.isCreate ? '#C9FFFF' : this.srcNote.color;
    this.noteContent.nativeElement.style.height = 'auto';
    this.isReadonly = !this.isCreate;
  }

  save() {
    this.srcNote.title = this.title;
    this.srcNote.content = this.content;
    this.srcNote.color = this.color;
    if (this.isCreate) {
      this.srcNote.id = -1;
      this.noteService.save(new Note(this.srcNote));
    } else {
      this.noteService.save(this.srcNote);
    }
    this.isReadonly = true;
  }

  ngAfterViewInit() {
    this.subscription.add(fromEvent(this.noteColor.nativeElement, 'keyup').subscribe(() => {
      if (!this.isCreate) {
        this.save();
      }
    }));
  }

  ngOnChanges(change: SimpleChanges) {
    if (!('isOpen' in change)) {
      return;
    }

    if (change.isOpen) {
      setTimeout(() => {
        this.noteTitle.nativeElement.focus();
      }, 0);
    }
  }

  colorChange(newColor: string) {
    if (this.isCreate) {
      return;
    }
    this.save();
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
        this.save();
        break;
      case 'Escape':
        this.reset();
        break;
      default:
        break;
    }
  }

  turnOnEditMode() {
    this.isReadonly = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
