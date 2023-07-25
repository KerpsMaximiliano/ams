import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

// * Services
import { FuenteIngresoService } from 'src/app/core/services/fuente-ingreso.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ProductoService } from 'src/app/core/services/producto.service';

// * Interfaces
import { IProductoAdministrador } from 'src/app/core/models/producto-administrador.interface';
import { IFuenteIngreso } from 'src/app/core/models/fuente-ingreso.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { FuenteIngresoSetDialogComponent } from '../set-fuente-ingreso-dialog/set-fuente-ingreso-dialog.component';
import { SetProdSubDialogComponent } from '../set-producto-dialog/set-producto-dialog.component';

@Component({
  selector: 'app-mvmts-novedades-auto-filter',
  templateUrl: './mvmts-novedades-auto-filter.component.html',
  styleUrls: ['./mvmts-novedades-auto-filter.component.scss'],
})
export class MvmtsNovedadesAutoFilterComponent {
  private codigo_fuente_ingreso: Number;
  @Output() private search: EventEmitter<any> = new EventEmitter<any>();

  constructor(private dialog: MatDialog,
    private fuenteIngresoService: FuenteIngresoService,
    private productoService: ProductoService,
    private utilService: UtilService) {}

  public performSearch(event: any, inputCapita: HTMLInputElement, descripcionProducto: HTMLInputElement, descripcionSubproducto: HTMLInputElement,inputPlan: HTMLInputElement, inputCodigoPlan: HTMLInputElement): void {
    event.preventDefault();
    this.search.emit(
      JSON.stringify({
        par_modo: "O",
        nombre_fuente: inputCapita.value,
        nombre_prod: descripcionProducto.value,
        nombre_sub_prod: descripcionSubproducto.value,
        nombre_plan: inputPlan.value,
        plan_origen: inputCodigoPlan.value
      })
    );
  }

  public clearInput(campo: string, inputCapita: HTMLInputElement, descripcionProducto: HTMLInputElement, descripcionSubproducto: HTMLInputElement,inputPlan: HTMLInputElement, inputCodigoPlan: HTMLInputElement): void{
    switch(campo){
      case 'capita_origen':
        this.codigo_fuente_ingreso = 0;
        inputCapita.value = '';
        descripcionProducto.value = '';
        descripcionSubproducto.value = '';
        break;
      case 'producto':
        descripcionProducto.value = '';
        descripcionSubproducto.value = '';
        break;
      case 'limpiar':
        inputPlan.value = '';
        inputCodigoPlan.value = ''
        break;
    }
  }

  public getFuenteIngreso(inputCapita: HTMLInputElement, descripcionProducto: HTMLInputElement, descripcionSubproducto: HTMLInputElement): void {
    this.utilService.openLoading();
    this.fuenteIngresoService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          descripcion: '',
          desc_empresa: ''
        })
      )
      .subscribe({
        next: (res: any) => {
          let data: IFuenteIngreso[] = Array.isArray(res.dataset)
            ? (res.dataset as IFuenteIngreso[])
            : [res.dataset as IFuenteIngreso];
          this.setFuenteIngreso(data, inputCapita, descripcionProducto, descripcionSubproducto);
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          err.status == 0
            ? this.utilService.notification('Error de conexión. ', 'error')
            : this.utilService.notification(
                `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                'error'
              );
        },
        complete: () => {
          this.utilService.closeLoading();
        },
      });
  }

  public getProducto(descripcionProducto: HTMLInputElement, descripcionSubproducto: HTMLInputElement): void {
    this.utilService.openLoading();
    let value = {}
  this.codigo_fuente_ingreso && this.codigo_fuente_ingreso !== 0 ?
      value = {par_modo: 'F', codigo_fuente_ingreso: this.codigo_fuente_ingreso }
      : value = {par_modo: 'O', descripcion_producto: ""}
    this.productoService
    .CRUD(
      JSON.stringify(value)
    ).subscribe({
        next: (res: any) => {
          let data: IProductoAdministrador[] = Array.isArray(res.dataset)
            ? (res.dataset as IProductoAdministrador[])
            : [res.dataset as IProductoAdministrador];
          this.setProducto(data, descripcionProducto, descripcionSubproducto);
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          err.status == 0
            ? this.utilService.notification('Error de conexión. ', 'error')
            : this.utilService.notification(
                `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                'error'
              );
        },
        complete: () => {
          this.utilService.closeLoading();
        },
      });
    }

  private setProducto(data: IProductoAdministrador[], descripcionProducto: HTMLInputElement, descripcionSubproducto: HTMLInputElement){
    const modalSetProd = this.dialog.open(SetProdSubDialogComponent, {
      data: {
        title: 'SELECCIONE PRODUCTO',
        data: data
      },
    });
    modalSetProd.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          descripcionSubproducto.value =   res.descripcion_producto_administrador
          ? res.descripcion_producto || ''
          : ''
          descripcionProducto.value = res.descripcion_producto_administrador ? res.descripcion_producto_administrador.trim() : res.descripcion_producto;
        }
      },
    });
  }

  private setFuenteIngreso(data: IFuenteIngreso[], inputCapita: HTMLInputElement, descripcionProducto: HTMLInputElement, descripcionSubproducto: HTMLInputElement){
    const modalCapita = this.dialog.open(FuenteIngresoSetDialogComponent, {
      data: {
        title: 'SELECCIONE UNA FUENTE DE INGRESO',
        data: data
      },
    });
    modalCapita.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          inputCapita.value = res.descripcion;
          descripcionSubproducto.value = '';
          descripcionProducto.value = '';
          this.codigo_fuente_ingreso = res.codigo_fuente_ingreso;
        }
      },
    });
  }
}
