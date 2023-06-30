import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProducto } from 'src/app/core/models/producto.interface';

@Component({
  selector: 'app-parentesco-producto-filter',
  templateUrl: './parentesco-producto-filter.component.html',
  styleUrls: ['./parentesco-producto-filter.component.scss'],
})
export class ParentescoProductoFilterComponent {
  @Input() public producto: IProducto;
  @Output() public search: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  public performSearch(event: any, value: string): void {
    event.preventDefault();
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        producto: this.producto.codigo_producto,
        descripcion: value,
      })
    );
  }

  public clear(inputElement: HTMLInputElement) {
    inputElement.value = '';
  }
}
