import { Component, EventEmitter, Input, Output } from '@angular/core';

// * Services

// * Forms
import { FormControl, FormGroup } from '@angular/forms';
// * Interface
import { IEmpresaFactura } from 'src/app/core/models/empresa-factura.interface';

@Component({
  selector: 'app-fuente-ingreso-filter',
  templateUrl: './fuente-ingreso-filter.component.html',
  styleUrls: ['./fuente-ingreso-filter.component.scss'],
})
export class FuenteIngresoFilterComponent {
  @Input() public datosEmpresas: IEmpresaFactura[];
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  searchForm = new FormGroup({
    par_modo: new FormControl('O'),
    descripcion: new FormControl(''),
    empresa_asociada: new FormControl(''),
  });
  listEmpresas: any;

  constructor() {}

  ngOnInit() {}

  public limpiar(): boolean {
    return this.searchForm.get('descripcion')?.value != '' ||
      this.searchForm.get('empresa_asociada')?.value != ''
      ? false
      : true;
  }

  public search() {
    this.searchEvent.emit(this.searchForm.value);
  }

  public clearInputs() {
    this.searchForm.get('descripcion')?.setValue('');
    this.searchForm.get('empresa_asociada')?.setValue('');
  }

  public searchKeyUp(e: any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searchForm.value);
  }
}
