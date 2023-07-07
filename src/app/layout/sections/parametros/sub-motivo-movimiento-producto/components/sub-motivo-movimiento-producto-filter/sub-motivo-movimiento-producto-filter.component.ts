import { Component, EventEmitter, Input, Output } from '@angular/core';

// * Interfaces
import { IMotivoMovimientoProducto } from 'src/app/core/models/motivo-movimiento-producto.interface';

@Component({
  selector: 'app-sub-motivo-movimiento-producto-filter',
  templateUrl: './sub-motivo-movimiento-producto-filter.component.html',
  styleUrls: ['./sub-motivo-movimiento-producto-filter.component.scss'],
})
export class SubmotivoMovimientoProductoFilterComponent {
  @Input() public motivoMovimientoProducto: IMotivoMovimientoProducto;

  @Output() public search: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  public performSearch(value: string) {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        movimiento: this.motivoMovimientoProducto.tipo_motivo,
        codigo_motivo: this.motivoMovimientoProducto.codigo_motivo,
        producto: this.motivoMovimientoProducto.id_producto,
        descripcion: value,
      })
    );
  }

  public getMovimiento(value: string) {
    switch (value) {
      case 'A':
        return 'ALTA';
      case 'B':
        return 'BAJA';
      case 'S':
        return 'SUSPENDIDO';
      case 'O':
        return 'OSP';
      default:
        return '';
    }
  }

  public clear(input: HTMLInputElement): void {
    input.value = '';
  }
}
