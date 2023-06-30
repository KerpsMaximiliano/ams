import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-producto-filter',
  templateUrl: './producto-filter.component.html',
  styleUrls: ['./producto-filter.component.scss'],
})
export class ProductoFilterComponent {
  @Output() public search: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('empresa') public empresa: any;

  constructor() {}

  public performSearch(producto: string): void {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        numero_empresa_factura: this.empresa?.value,
        descripcion_producto: producto,
      })
    );
  }

  public clear(producto: HTMLInputElement): void {
    this.empresa.value = '';
    producto.value = '';
  }
}
