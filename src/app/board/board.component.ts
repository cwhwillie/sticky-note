import {
  Component, OnInit, OnDestroy,
  AfterViewInit, ViewChild, ElementRef
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
  @ViewChild('newNoteElement') newNoteElement: ElementRef;

  private subscription: Subscription;

  private newNote: Note;
  private bNewNoteShow: boolean;

  private notes: Note[];

  constructor(private noteService: NoteDataService) { }

  ngOnInit() {
    this.subscription = new Subscription();

    this.subscription.add(this.noteService.update$.subscribe(e => {
      this.notes = (e as CustomEvent).detail;
    }));

    this.notes = this.noteService.load();
    this.newNote = new Note();
    this.bNewNoteShow = false;
  }

  ngAfterViewInit() {
    this.subscription.add(fromEvent(document, 'click')
      .subscribe((event: MouseEvent) => {
        let element = event.target as Element;
        while (element != null && element !== this.newNoteElement.nativeElement) {
          element = element.parentElement;
        }
        if (element == null) {
          this.bNewNoteShow = false;
        }
      }));
  }

  click(event: MouseEvent) {
    if (event.target !== this.noteBoard.nativeElement) {
      return;
    }

    this.newNote.x = event.offsetX;
    this.newNote.y = event.offsetY;
    this.bNewNoteShow = true;

    event.stopPropagation();
  }

  updateOrder(id: number) {
    this.noteService.active(id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
