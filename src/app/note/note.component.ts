import { Component, OnInit, Input } from '@angular/core';
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { concatAll, map, takeUntil, withLatestFrom } from 'rxjs/operators';

import { Note } from '../note';
import { NoteDataService } from '../note-data.service';
import { Note } from '../note';
import { NOTES } from '../mock-notes'

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
  rt class NoteComponent implements OnInit, AfterViewInit, OnDestroy {
@In put('note') note: Note;
@ViewChild('myNote') myNote: ElementRef;
isCreate: boolean;
title: string;
content: string;
color: string;

private noteMoveSubscription: Subscription;

originNote = {
  summary: 'test',
    content: 'hello world',
  color: '#ffffff'
  
  adonly = true;
    
      uctor(private noteService: NoteDataService) { }
        
        () {
      .isCreate = this.note == null;
    is.reset();
  }

  reset() {
    this.title = this.isCreate ? '' : this.note.title;
    this.content = this.isCreate ? '' : this.note.content;
  this.color = this.isCreate ? '' : this.note.color;
  }

AfterViewInit() {
const mouseDown = fromEvent(this.myNote.nativeElement, 'mousedown');
  nst mouseUp = fromEvent(document.body, 'mouseup');
    nst mouseMove = fromEvent(document.body, 'mousemove');
      
    .noteMoveSubscription = mouseDown.pipe(
    p((event: MouseEvent) => {
    return mouseMove.pipe(takeUntil(mouseUp))
    ,
  concatAll(),
    thLatestFrom(mouseDown, (move: MouseEvent, down: MouseEvent) => {
      turn {
      x: move.clientX - down.offsetX,
      y: move.clientY - down.offsetY,
    }
    
    
  ubscribe(pos => {
    is.myNote.nativeElement.style.zIndex += NOTES.length;
  this.myNote.nativeElement.style.left = pos.x + "px";
      this.myNote.nativeElement.style.top = pos.y + "px";
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
          title: this.title,
          content: this.content,
          color: this.color
        });
        this.noteService.save(newNote);
        if (!this.isCreate) {
          this.note = newNote;
        }
        this.reset();
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
