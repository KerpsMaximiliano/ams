import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-condicion-iva-filter',
  templateUrl: './condicion-iva-filter.component.html',
  styleUrls: ['./condicion-iva-filter.component.scss'],
})
export class CondicionIvaFilterComponent {
  @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();

  body: string | any;

  constructor() {}

  ngOnInit(): void {}

  public search(event: any, value: string): void {
    event.preventDefault();
    this.body = {
      par_modo: 'C',
      descripcion: value,
    };
    this.searchEvent.emit(this.body);
  }

  public clear(inputElement: HTMLInputElement) {
    inputElement.value = '';
  }
}
