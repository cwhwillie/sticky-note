import {
  Component, OnInit, OnDestroy,
  AfterViewInit, ViewChild, ElementRef
} from '@angular/core';

import { fromEvent, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Note } from '../note';
import { NoteDataService } from '../note-data.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('noteBoard') noteBoard: ElementRef;
  @ViewChild('newNoteElement') newNoteElement: ElementRef;

  private subscription: Subscription;

  newNote: Note;
  bNewNoteShow: boolean;

  notes: Note[];

  constructor(private noteService: NoteDataService) { }

  ngOnInit() {
    this.subscription = new Subscription();

    this.subscription.add(this.noteService.update$.subscribe(e => {
      this.notes = (e as CustomEvent).detail;
      this.bNewNoteShow = false;
    }));

    this.notes = this.noteService.load();
    this.newNote = new Note();
    this.bNewNoteShow = false;
  }

  ngAfterViewInit() {
    this.subscription.add(fromEvent(document, 'click')
      .subscribe((event: MouseEvent) => {
        if (event.target !== this.newNoteElement.nativeElement &&
          !this.newNoteElement.nativeElement.contains(event.target)) {
          this.bNewNoteShow = false;
        }
      }));
  }

  click(event: MouseEvent) {
    if (this.bNewNoteShow &&
      event.target !== this.newNoteElement.nativeElement &&
      !this.newNoteElement.nativeElement.contains(event.target)) {
      this.bNewNoteShow = false;
      return;
    }

    if (event.target !== this.noteBoard.nativeElement) {
      return;
    }

    this.newNote.x = event.offsetX;
    this.newNote.y = event.offsetY;
    this.bNewNoteShow = true;
    this.noteService.active();

    event.stopPropagation();
  }

  mousedown(note: Note, event: MouseEvent) {
    this.noteService.active(note.id);

    const startX = note.x;
    const startY = note.y;
    fromEvent(this.noteBoard.nativeElement, 'mousemove').pipe(
      takeUntil(fromEvent(document, 'mouseup'))
    ).subscribe((moveEvent: MouseEvent) => {
      this.noteService.updatePosition({
        id: note.id,
        x: moveEvent.clientX - event.clientX + startX,
        y: moveEvent.clientY - event.clientY + startY
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
