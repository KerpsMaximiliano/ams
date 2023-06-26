import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-motivo-movimiento-filter',
  templateUrl: './motivo-movimiento-filter.component.html',
  styleUrls: ['./motivo-movimiento-filter.component.scss'],
})
export class MotivoMovimientoFilterComponent {
  @Output() public search: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('selectOptions') public selectOptions: any;

  constructor() {}

  public performSearch(value: string): void {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        tipo_motivo: this.selectOptions?.value,
        descripcion: value,
      })
    );
  }

  public clear(inputElement: HTMLInputElement): void {
    this.selectOptions.value = '';
    inputElement.value = '';
  }
}
