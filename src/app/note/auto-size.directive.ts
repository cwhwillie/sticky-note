import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appAutoSize]'
})
export class AutoSizeDirective {

  //@Input() 
  constructor(private element: ElementRef) { }

  @HostListener('input') onInput() {
    this.element.nativeElement.style.height = 'auto';
    this.element.nativeElement.style.height = this.element.nativeElement.scrollHeight + 'px';
  }
}
