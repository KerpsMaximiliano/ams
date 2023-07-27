import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IEmpresaFactura } from 'src/app/core/models/empresa-factura.interface';

@Component({
  selector: 'app-pago-link-filter',
  templateUrl: './pago-link-filter.component.html',
  styleUrls: ['./pago-link-filter.component.scss'],
})
export class PagoLinkFilterComponent {
  @Output() public search: EventEmitter<string> = new EventEmitter<string>();
  @Input() public empresa: IEmpresaFactura;
  constructor() {}

  ngOnInit() {}

  public searching(input: string) {
    this.search.emit(
      JSON.stringify({
        par_modo: 'R',
        empresa_factura: this.empresa.id_empresa,
        codigo_forma_pago: input.toUpperCase(),
      })
    );
  }

  public clear(input: HTMLInputElement): void {
    input.value = '';
  }
}
