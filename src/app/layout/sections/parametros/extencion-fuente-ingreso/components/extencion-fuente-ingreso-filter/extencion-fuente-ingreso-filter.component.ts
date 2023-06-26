import { Component, EventEmitter, Output } from '@angular/core';
// * service
import { ExtencionFuenteIngresoService } from 'src/app/core/services/extencion-fuente-ingreso.service';
// * Forms
import { UntypedFormControl, FormGroup } from '@angular/forms';
// * Material
import { MatDialog } from '@angular/material/dialog';
// * Validator
import { getErrorMessage } from 'src/app/core/validators/character.validator';
// * Components
import { ModalExtencionProductoComponent } from '../add-edit-extencion-fuente-ingreso/modal-extencion-producto/modal-extencion-producto.component';

@Component({
  selector: 'app-extencion-fuente-ingreso-filter',
  templateUrl: './extencion-fuente-ingreso-filter.component.html',
  styleUrls: ['./extencion-fuente-ingreso-filter.component.scss'],
})
export class ExtencionFuenteIngresoFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  public getErrorMessage = getErrorMessage;

  public fuenteIngreso: { fuenteIngreso: string; codigo: number };
  searchForm = new FormGroup({
    fuente_ingreso: new UntypedFormControl({ value: '', disabled: true }),
    fuente_ingreso_cod: new UntypedFormControl({ value: 0, disabled: true }),
    producto: new UntypedFormControl(''),
    producto_cod: new UntypedFormControl(''),
    vigencia: new UntypedFormControl(''),
  });

  constructor(private _extencionFuenteIngreso: ExtencionFuenteIngresoService,
    private dialog: MatDialog,
    ) {
    this.fuenteIngreso = this._extencionFuenteIngreso.getFuenteIngreso();
  }

  ngOnInit() {
    this.cargaDatos();
  }

  cargaDatos() {
    this.searchForm
      .get('fuente_ingreso')
      ?.setValue('prueba'
        // this.fuenteIngreso.fuenteIngreso
        );
    this.searchForm
      .get('fuente_ingreso_cod')
      ?.setValue(1
        // this.fuenteIngreso.codigo
        );
    this.searchForm.get('fuente_ingreso')?.disable;
  }

  getProducto() {
    const ModalNuevoProductoComponent = this.dialog.open(
      ModalExtencionProductoComponent,
      {
        data: {},
      }
    );
    ModalNuevoProductoComponent.afterClosed().subscribe({
      next: (res: any) => {
        if (res) {
          this.searchForm.get('producto')?.setValue(res.producto_principal);
          this.searchForm
            .get('producto_cod')
            ?.setValue(res.descripcion_producto_cod);
        }
      },
    });
  }

  public search() {
    this.searchEvent.emit(this.searchForm.value);
  }

  public limpiarProducto(): void {
    this.searchForm.get('producto')?.setValue('');
    this.searchForm.get('producto_cod')?.setValue(0);
  }

  public limpiar(): boolean {
    return this.searchForm.get('producto')?.value != '' ||
      this.searchForm.get('vigencia')?.value != ''
      ? false
      : true;
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
