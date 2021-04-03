import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appPasswordMatch]'
})
export class PasswordMatchDirective {

  @Input() password1; 
  @Input() password2;
  constructor(private _el: ElementRef) {}
  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    if (this.password1.value === this.password2.value) {
      this.password2.setErrors(null);
    } else if (this.password2.value.length > 0) {
      this.password2.setErrors({ match: true });
    }
  }

}
