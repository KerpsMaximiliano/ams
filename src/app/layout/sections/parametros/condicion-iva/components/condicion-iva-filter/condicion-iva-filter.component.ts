import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-condicion-iva-filter',
  templateUrl: './condicion-iva-filter.component.html',
  styleUrls: ['./condicion-iva-filter.component.scss'],
})
export class CondicionIvaFilterComponent {
  @Output() public search: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  public performSearch(value: string): void {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        descripcion: value,
      })
    );
  }

  public clear(inputElement: HTMLInputElement): void {
    inputElement.value = '';
  }
}
