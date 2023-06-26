import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-provincia-filter',
  templateUrl: './provincia-filter.component.html',
  styleUrls: ['./provincia-filter.component.scss'],
})
export class ProvinciaFilterComponent {
  @Output() public search: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  public performSearch(value: string): void {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        nombre_provincia: value,
      })
    );
  }

  public clear(inputElement: HTMLInputElement): void {
    inputElement.value = '';
  }
}
