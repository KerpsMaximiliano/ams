import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FuenteIngresoSetDialogComponent } from '../add-edit-mvmts-novedades-auto-dialog/fuente-ingreso-set-dialog/fuente-ingreso-set-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ProdSubSetDialogComponent } from '../add-edit-mvmts-novedades-auto-dialog/producto-set-dialog/producto-set-dialog.component';


@Component({
  selector: 'app-mvmts-novedades-auto-filter',
  templateUrl: './mvmts-novedades-auto-filter.component.html',
  styleUrls: ['./mvmts-novedades-auto-filter.component.scss'],
})
export class MvmtsNovedadesAutoFilterComponent {

  @Output() search: EventEmitter<any> = new EventEmitter<any>();

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

  public clear(inputCapita: HTMLInputElement, inputProducto: HTMLInputElement, inputSubProd: HTMLInputElement, inputPlan: HTMLInputElement): void {
    inputCapita.value = '';
    inputProducto.value = '';
    inputSubProd.value = '';
    inputPlan.value = '';
  }

  public clearInput(campo: string, input: HTMLInputElement, input2: HTMLInputElement): void{
    switch(campo){
      case 'capita_origen':
        input.value = '';
        break;
      case 'producto':
        input.value = '';
        input2.value = '';
        break;
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
            }
          },
        });
        break;
      case 'producto':
        const modalSetProd = this.dialog.open(ProdSubSetDialogComponent, {
          data: {
            title: 'SELECCIONE PRODUCTO - SUBPRODUCTO',
            edit: true,
          },
        });
        modalSetProd.afterClosed().subscribe({
          next: (res) => {
            if (res) {
             input.value = res.descripcion_producto;
             input2.value = res.descripcion_producto_administrador;
            }
          },
        });
        break;
      }
    }
}
