import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-monto-minimo-filter',
  templateUrl: './monto-minimo-filter.component.html',
  styleUrls: ['./monto-minimo-filter.component.scss'],
})
export class MontoMinimoFilterComponent {
  @Output() public search: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  public performSearch(actividad: HTMLInputElement): void {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        actividad: actividad.value
      })
    );
  }

  public clear(actividad: HTMLInputElement){
    actividad.value = '';
  }
}
