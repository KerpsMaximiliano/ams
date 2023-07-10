import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

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
  public booleanPlan: boolean = false;

  constructor(private dialog: MatDialog) {}

  public performSearch(event: any, inputCapita: HTMLInputElement, inputProducto: HTMLInputElement, inputSubProd: HTMLInputElement, inputPlan: HTMLInputElement): void {
    event.preventDefault();
    this.search.emit(
      JSON.stringify({
        par_modo: "O",
        nombre_fuente: inputCapita.value,
        nombre_prod: inputProducto.value,
        nombre_sub_prod: inputSubProd.value,
        nombre_plan: inputPlan.value
      })
    );
  }

  public clearInput(campo: string, inputCapita: HTMLInputElement, inputProducto: HTMLInputElement, inputSubProd: HTMLInputElement, inputPlan: HTMLInputElement): void{
    switch(campo){
      case 'capita_origen':
        inputCapita.value = '';
        inputProducto.value = '';
        inputSubProd.value = '';
        break;
      case 'producto':
        inputProducto.value = '';
        inputSubProd.value = '';
        break;
      case 'limpiar':
        inputPlan.value = '';
    }
  }

  public searchDialog(value: string, input: HTMLInputElement, input2: HTMLInputElement){
    switch(value){
      case 'capita_origen':
        const modalCapita = this.dialog.open(FuenteIngresoSetDialogComponent, {
          data: {
            title: 'SELECCIONE UNA FUENTE DE INGRESO',
            edit: true,
          },
        });
        modalCapita.afterClosed().subscribe({
          next: (res) => {
            if (res) {
              input.value = res.descripcion;
              this.codigo_fuente_ingreso = res.codigo_fuente_ingreso;
            }
          },
        });
        break;
      case 'producto':
        const modalSetProd = this.dialog.open(SetProdSubDialogComponent, {
          data: {
            title: 'SELECCIONE PRODUCTO',
            edit: true,
            codigo_fuente_ingreso: this.codigo_fuente_ingreso 
          },
        });
        modalSetProd.afterClosed().subscribe({
          next: (res) => {
            if (res) {
             input2.value = res.descripcion_producto ? res.descripcion_producto.trim() : '';
             input.value = res.descripcion_producto_administrador ? res.descripcion_producto_administrador.trim() : '';
             this.booleanPlan = true;
            }
          },
        });
        break;
      }
    }
}
