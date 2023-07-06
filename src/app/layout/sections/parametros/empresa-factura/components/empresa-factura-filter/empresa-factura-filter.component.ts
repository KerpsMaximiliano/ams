import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
// * Interface
import { IEmpresaFactura } from 'src/app/core/models/empresa-factura.interface';
// * service
import { EmpresaFacturaService } from 'src/app/core/services/empresa-factura.service';
// * Validator
import { getErrorMessage } from 'src/app/core/validators/character.validator';
// * Components

@Component({
  selector: 'app-empresa-factura-filter',
  templateUrl: './empresa-factura-filter.component.html',
  styleUrls: ['./empresa-factura-filter.component.scss'],
})
export class EmpresaFacturaFilterComponent {
  @Output() public searchEvent: EventEmitter<string> =
    new EventEmitter<string>();
  @ViewChild('select') public select: any;
  public getErrorMessage = getErrorMessage;
  listaEmpresasFacturan: IEmpresaFactura[];

  constructor(private _empresaFacturaService: EmpresaFacturaService) {
    this.cargaDatos();
  }

  ngOnInit() {}

  cargaDatos() {
    this._empresaFacturaService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          descripcion: '',
        })
      )
      .subscribe({
        next: (res: any) => {
          this.listaEmpresasFacturan = res.dataset;
        },
      });
  }

  public search() {
    this.searchEvent.emit(
      JSON.stringify({
        par_modo: 'O',
        descripcion: this.select?.value,
      })
    );
  }

  public clear(): void {
    this.select.value = '';
  }
}
