import { Component, EventEmitter, Output } from '@angular/core';
// * service
import { ExtencionFuenteIngresoService } from 'src/app/core/services/extencion-fuente-ingreso.service';
// * Forms
import { UntypedFormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-extencion-fuente-ingreso-filter',
  templateUrl: './extencion-fuente-ingreso-filter.component.html',
  styleUrls: ['./extencion-fuente-ingreso-filter.component.scss'],
})
export class ExtencionFuenteIngresoFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  public fuenteIngreso: { fuenteIngreso: string; codigo: number };
  searchForm = new FormGroup({
    fuente_ingreso: new UntypedFormControl({ value: '', disabled: true }),
    fuente_ingreso_cod: new UntypedFormControl({ value: 0, disabled: true }),
    producto: new UntypedFormControl(''),
    producto_cod: new UntypedFormControl(''),
    vigencia: new UntypedFormControl(''),
  });

  constructor(private _extencionFuenteIngreso: ExtencionFuenteIngresoService) {
    this.fuenteIngreso = this._extencionFuenteIngreso.getFuenteIngreso();
  }

  ngOnInit() {
    this.cargaDatos();
  }

  cargaDatos() {
    this.searchForm
      .get('fuente_ingreso')
      ?.setValue(this.fuenteIngreso.fuenteIngreso);
    this.searchForm
      .get('fuente_ingreso_cod')
      ?.setValue(this.fuenteIngreso.codigo);
    this.searchForm.get('fuente_ingreso')?.disable;
  }

  public search() {
    this.searchEvent.emit(this.searchForm.value);
  }

  public clearInputs() {
    this.searchForm.get('producto')?.setValue('');
    this.searchForm.get('producto_cod')?.setValue('');
    this.searchForm.get('vigencia')?.setValue('');
  }

  public searchKeyUp(e: any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searchForm.value);
  }
}
