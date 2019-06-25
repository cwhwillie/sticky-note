import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAutoSize]'
})
export class AutoSizeDirective {

  constructor(private _element: ElementRef) { }

  @HostListener('input') onInput() {
    this._element.nativeElement.style.height = 'auto';
    this._element.nativeElement.style.height = this._element.nativeElement.scrollHeight + 'px';
  }
}
