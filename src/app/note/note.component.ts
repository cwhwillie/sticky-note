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

    this.subscription.add(fromEvent(document, 'mousedown').subscribe((event: MouseEvent) => {
      if (!this.isCreate && !this.isReadonly) {
        if (event.target !== this.myNote.nativeElement && !this.myNote.nativeElement.contains(event.target)) {
          this.reset();
        }
      }
    }));
  }

  ngOnChanges(change: SimpleChanges) {
    if (!('isOpen' in change)) {
      return;
    }

    if (change.isOpen.currentValue) {
      setTimeout(() => {
        this.noteTitle.nativeElement.focus();
      }, 0);
    } else {
      this.reset();
    }
  }

  colorChange(newColor: string) {
    if (this.isCreate) {
      return;
    }
    this.save();
  }

  onKeyup(event: KeyboardEvent) {
    if (this.isReadonly) {
      return;
    }
    if (!event.shiftKey && (event.code === 'Enter' || event.code === 'NumpadEnter')) {
      this.save();
      this.noteContent.nativeElement.style.height = 'auto';
    } else if (event.code === 'Escape') {
      this.reset();
    }
  }

  turnOnEditMode() {
    this.isReadonly = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
