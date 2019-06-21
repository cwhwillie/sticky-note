import { Component, OnInit } from '@angular/core';

import { NoteDataService } from '../note-data.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  fakeNoteList = [
    { description: "note1" },
    { description: "note2dsfgdfgdfg dfsg dfgsdfg" }
  ];
  activeNote = -1;

  constructor(private noteService: NoteDataService) { }

  ngOnInit() {
  }

  delete(i: number) {
    this.fakeNoteList.splice(i, 1);
  }

  active(i: number) {
    this.activeNote = i;
  }
}