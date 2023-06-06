import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-condicion-iva-filter',
  templateUrl: './condicion-iva-filter.component.html',
  styleUrls: ['./condicion-iva-filter.component.scss'],
})
export class CondicionIvaFilterComponent {
  @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  public search(event: any, value: string): void {
    event.preventDefault();
    let body = {
      par_modo: 'O',
      descripcion: value,
    };
    this.searchEvent.emit(JSON.stringify(body));
  }

  public clear(inputElement: HTMLInputElement) {
    inputElement.value = '';
  }
}
