import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-condicion-iva-filter',
  templateUrl: './condicion-iva-filter.component.html',
  styleUrls: ['./condicion-iva-filter.component.scss']
})
export class CondicionIvaFilterComponent {
  body: string | any;
  @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();

  public descripcion = new UntypedFormControl('');
  constructor() { }
  
  ngOnInit(): void {}

  public search(event: any, value: string): void {
    event.preventDefault();
    this.body = {
      par_modo: 'C',
      codigo: value,
      descripcion: value,
    };
    this.searchEvent.emit(this.body);
  }

  public clear(inputElement: HTMLInputElement) {
    inputElement.value = '';
  }
}