import {
  Component, OnInit, OnDestroy,
  AfterViewInit, ViewChild,
  ElementRef, ChangeDetectorRef
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

import { Note } from '../note';
import { NoteDataService } from '../note-data.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('noteBoard') noteBoard: ElementRef;
  @ViewChild('newNoteElemt') newNoteElemt: ElementRef;

  private mouseClick$: any;
  private subscription: Subscription;
  private newNote: Note;
  private notes: Note[];
  private bNewNoteShow: boolean;
  private bContentFocus: boolean;

  constructor(private noteService: NoteDataService,
    public changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.subscription = new Subscription();

    this.subscription.add(this.noteService.update$.subscribe(e => {
      this.notes = (e as CustomEvent).detail;
    }));

    this.notes = this.noteService.load();
    this.newNoteReset();
  }

  newNoteReset() {
    this.bNewNoteShow = false;
    this.bContentFocus = false;
    this.newNote = {
      title: '',
      content: '',
      color: '',
      x: 0,
      y: 0,
      z: 0
    };
  }

  ngAfterViewInit() {
    this.mouseClick$ = fromEvent(this.noteBoard.nativeElement, 'click');
    this.subscription.add(this.mouseClick$.subscribe((evt: MouseEvent) => {
      if (evt.target === evt.currentTarget) {
        this.newNoteReset();
        setTimeout(() => {
          this.newNote.x = evt.clientX;
          this.newNote.y = evt.clientY;
          this.newNote.z = this.noteService.getNoteNum();
          this.bNewNoteShow = true;
          this.bContentFocus = true;
        }, 0);
      }
    }));
  }

  updateOrder(id: number) {
    this.noteService.active(id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
