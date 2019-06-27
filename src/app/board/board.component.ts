import { Component, OnInit } from '@angular/core';
import { AfterViewInit, OnDestroy } from '@angular/core';
import { ElementRef, ViewChild, ChangeDetectorRef} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { noComponentFactoryError } from '@angular/core/src/linker/component_factory_resolver';

import { Note } from '../note';
import { NoteDataService } from '../note-data.service';
import { ValueTransformer } from '@angular/compiler/src/util';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('noteBoard') noteBoard: ElementRef;
  @ViewChild('newNoteElemt') newNoteElemt: ElementRef;

  private mouseClick$: any;
  private mouseClickSubscription: Subscription;
  private newNote: Note;
  private notes: Note[];
  private bNewNoteShow: boolean;
  private bContentFocus: boolean;

  constructor(private noteService: NoteDataService,
              public changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.noteService.update$.subscribe(() => {
      this.notes = this.noteService.load();
    });
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
    this.mouseClickSubscription = this.mouseClick$.subscribe((evt: MouseEvent) => {
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
    });
  }

  ngOnDestroy() {
    this.mouseClickSubscription.unsubscribe();
  }

  updateOrder(id: number) {
    this.noteService.active(id);
  }
}
