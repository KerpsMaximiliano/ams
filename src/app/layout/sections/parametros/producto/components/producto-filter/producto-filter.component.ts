import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-producto-filter',
  templateUrl: './producto-filter.component.html',
  styleUrls: ['./producto-filter.component.scss'],
})
export class ProductoFilterComponent {
  @Output() public search: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('select') public select: any;

  constructor() {}

  public performSearch(input: string): void {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        numero_empresa_factura: this.select?.value,
        descripcion_producto: input,
      })
    );
  }

  public clear(input: HTMLInputElement): void {
    this.select.value = '';
    input.value = '';
  }
}
