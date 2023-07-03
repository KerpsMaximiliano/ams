import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IProducto } from 'src/app/core/models/producto.interface';

@Component({
  selector: 'app-movimiento-producto-filter',
  templateUrl: './movimiento-producto-filter.component.html',
  styleUrls: ['./movimiento-producto-filter.component.scss'],
})
export class MovimientoProductoFilterComponent {
  @Input() public producto: IProducto;
  @Output() public search: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('tipo') private tipo: any;

  public tipos: string[] = ['A-ALTA', 'B-BAJA', 'S-SUSPENDIDO', 'O-OSP'];

  constructor() {}

  public performSearch(event: Event, value: string): void {
    event.preventDefault();
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        tipo_motivo: this.tipo.value !== undefined ? this.tipo.value[0] : '',
        id_producto: this.producto.codigo_producto,
        descripcion: value,
      })
    );
  }

  public clear(inputElement: HTMLInputElement) {
    this.tipo.value = '';
    inputElement.value = '';
  }
}
