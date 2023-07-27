import { Component, EventEmitter, Input, Output } from '@angular/core';
// * service
import { ExtencionFuenteIngresoService } from 'src/app/core/services/extencion-fuente-ingreso.service';
import { FuenteIngresoService } from 'src/app/core/services/fuente-ingreso.service';
// * Interface
import { IExtencionFuenteIngreso } from 'src/app/core/models/extencion-fuente-ingreso.interface';
import { IFuenteIngreso } from 'src/app/core/models/fuente-ingreso.interface';
// * Forms
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
// * Material
import { MatDialog } from '@angular/material/dialog';
// * Validator
import { getErrorMessage } from 'src/app/core/validators/character.validator';
// * Components
import { ModalExtencionProductoComponent } from '../add-edit-extencion-fuente-ingreso/modal-extencion-producto/modal-extencion-producto.component';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-extencion-fuente-ingreso-filter',
  templateUrl: './extencion-fuente-ingreso-filter.component.html',
  styleUrls: ['./extencion-fuente-ingreso-filter.component.scss'],
})
export class ExtencionFuenteIngresoFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() validaBoton: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() public fuenteIngreso: IFuenteIngreso;
  public getErrorMessage = getErrorMessage;
  public listaFechas: IExtencionFuenteIngreso[];
  searchForm = new UntypedFormGroup({
    fuente_ingreso: new UntypedFormControl(),
    codigo_fuente_ingreso: new UntypedFormControl(),
    producto: new UntypedFormControl(0),
    producto_des: new UntypedFormControl(''),
    fecha_de_vigencia: new UntypedFormControl(''),
  });

  constructor(
    private extencionFuenteIngresoService: ExtencionFuenteIngresoService,
    private dialog: MatDialog,
    private utilService: UtilService
  ) {
  }

  ngOnInit() {
    this.cargaDatos();
  }

  cargaDatos() {
    this.searchForm
      .get('codigo_fuente_ingreso')
      ?.setValue(this.fuenteIngreso?.codigo_fuente_ingreso);
    this.searchForm
      .get('fuente_ingreso')
      ?.setValue(this.fuenteIngreso?.descripcion);
    this.searchForm.get('fuente_ingreso')?.disable;
  }

  getProducto() {
    const ModalNuevoProductoComponent = this.dialog.open(
      ModalExtencionProductoComponent,
      {
        data: {
          title: 'SELECCIONE UN PRODUCTO',
          data: {},
        },
      }
    );
    ModalNuevoProductoComponent.afterClosed().subscribe({
      next: (res: any) => {
        if (res) {
          this.searchForm.get('producto')?.setValue(res.codigo_producto);
          this.searchForm
            .get('producto_des')
            ?.setValue(res.descripcion_producto);
        }
      },
    });
  }

  public validarBoton(): boolean {
    return this.searchForm.get('producto')?.value != 0 &&
      this.searchForm.get('producto_des')?.value != '' &&
      this.searchForm.get('fecha_de_vigencia')?.value != 0
      ? false
      : true;
  }

  public search() {
    this.searchEvent.emit(this.searchForm.value);
  }

  public limpiarProducto(): void {
    this.searchForm.get('producto')?.setValue(0);
    this.searchForm.get('producto_des')?.setValue('');
  }

  public limpiar(): boolean {
    return this.searchForm.get('producto')?.value != 0 ||
      this.searchForm.get('producto_des')?.value != '' ||
      this.searchForm.get('fecha_de_vigencia')?.value != ''
      ? false
      : true;
  }

  fechas() {
    this.extencionFuenteIngresoService
      .CRUD(
        JSON.stringify({
          par_modo: 'R',
          codigo_fuente_ingreso: this.searchForm.get('codigo_fuente_ingreso')
            ?.value,
          producto: this.searchForm.get('producto')?.value,
        })
      )
      .subscribe({
        next: (res: any) => {
          this.listaFechas = res.dataset;
        },
      });
  }

  formatearFecha(numero: number): string {
    const enteros = Math.floor(numero / 100);
    const decimales = numero % 100;
    return `${enteros}/${decimales}`;
  }

  public clearInputs() {
    this.searchForm.get('producto')?.setValue(0);
    this.searchForm.get('producto_des')?.setValue('');
    this.searchForm.get('fecha_de_vigencia')?.setValue('');
  }

  public searchKeyUp(e: any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searchForm.value);
  }

  public validarBotonValor() {
    this.utilService.openLoading();
    this.extencionFuenteIngresoService
      .CRUD(
        JSON.stringify({
          par_modo: 'H',
          codigo_fuente_ingreso: this.searchForm.get(
            'codigo_fuente_ingreso'
          )?.value,
          fecha_de_vigencia:
            this.searchForm.get('fecha_de_vigencia')?.value,
          producto: this.searchForm.get('producto')?.value,
        })
      )
      .subscribe({
        next: (res: any) => {
          this.utilService.closeLoading();
          if (res.dataset.remuneracion_hasta >= 999999999.99) {
            this.validaBoton.emit(true);
          } else {
            this.validaBoton.emit(false);
          }
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          if (err.esatado.Codigo == 404)
          this.validaBoton.emit(false);
        },
        complete: () => {
          this.utilService.closeLoading();
        },
      });
  }
}
