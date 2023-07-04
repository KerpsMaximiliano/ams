import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IProducto } from 'src/app/core/models/producto.interface';

@Component({
  selector: 'app-motivo-movimiento-producto-filter',
  templateUrl: './motivo-movimiento-producto-filter.component.html',
  styleUrls: ['./motivo-movimiento-producto-filter.component.scss'],
})
export class MotivoMovimientoProductoFilterComponent {
  public tipos: string[] = ['A-ALTA', 'B-BAJA', 'S-SUSPENDIDO', 'O-OSP'];

  @Input() public producto: IProducto;
  @Output() public search: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('select') private select: any;

  constructor() {}

  public performSearch(event: Event, value: string): void {
    event.preventDefault();
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        tipo_motivo:
          this.select.value !== undefined ? this.select.value[0] : '',
        id_producto: this.producto.codigo_producto,
        descripcion: value,
      })
    );
  }

  public clear(inputElement: HTMLInputElement) {
    this.select.value = '';
    inputElement.value = '';
  }
}
