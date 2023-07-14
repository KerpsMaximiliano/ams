import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

// * Interfaces
import { IEmpresaFactura } from 'src/app/core/models/empresa-factura.interface';

@Component({
  selector: 'app-producto-filter',
  templateUrl: './producto-filter.component.html',
  styleUrls: ['./producto-filter.component.scss'],
})
export class ProductoFilterComponent {
  @Output() public search: EventEmitter<string> = new EventEmitter<string>();

  @Input() public empresaFactura: IEmpresaFactura[];

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
