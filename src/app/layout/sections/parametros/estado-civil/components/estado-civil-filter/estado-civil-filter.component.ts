import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-estado-civil-filter',
  templateUrl: './estado-civil-filter.component.html',
  styleUrls: ['./estado-civil-filter.component.scss'],
})
export class EstadoCivilFilterComponent {
  @Output() public search: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  public performSearch(value: string): void {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        description: value,
      })
    );
  }

  public clear(inputElement: HTMLInputElement): void {
    inputElement.value = '';
  }
}
