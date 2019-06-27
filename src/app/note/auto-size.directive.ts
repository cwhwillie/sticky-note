import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAutoSize]'
})
export class AutoSizeDirective {

  constructor(private element: ElementRef) { }

  @HostListener('input') onInput() {
    this.element.nativeElement.style.height = 'auto';
    this.element.nativeElement.style.height = this.element.nativeElement.scrollHeight + 'px';
  }

  @HostListener('dblclick') onDbclick() {
    this.element.nativeElement.style.height = this.element.nativeElement.scrollHeight + 'px';
  }
}
