import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { ProductoService } from 'src/app/core/services/producto.service';

// * Interfaces
import { IFuenteIngreso } from 'src/app/core/models/fuente-ingreso.interface';
import { IProducto } from 'src/app/core/models/producto.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { AtributosRelacionCapitaPlanSetProductoDialogComponent } from '../atributos-relacion-capita-plan-set-producto-dialog/atributos-relacion-capita-plan-set-producto-dialog.component';

@Component({
  selector: 'app-atributos-relacion-capita-plan-filter',
  templateUrl: './atributos-relacion-capita-plan-filter.component.html',
  styleUrls: ['./atributos-relacion-capita-plan-filter.component.scss'],
})
export class AtributosRelacionCapitaPlanFilterComponent {
  private codigoProducto: any;
  private codigoSubproducto: any;

  @Input() public fuenteIngreso: IFuenteIngreso;
  @Output() public search: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('descripcionProducto') public descripcionProducto: any;
  @ViewChild('descripcionSubproducto') public descripcionSubproducto: any;

  constructor(
    private productoService: ProductoService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  public performSearch(value: string): void {
    // this.search.emit(
    //   JSON.stringify({
    //     par_modo: 'O',
    //     codigo_fuente_adm_mixta: this.fuenteIngreso.codigo_fuente_admin,
    //     cod_fuente_subordinada: this.fuenteIngreso.codigo_fuente_ingreso,
    //     producto_cap_adm: this.codigoProducto,
    //     prodcuto_cap_sub: this.codigoSubproducto,
    //     descripcion: value,
    //   })
    // );
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        codigo_fuente_adm_mixta: 1,
        cod_fuente_subordinada: 0,
        producto_cap_adm: 16,
        prodcuto_cap_sub: 0,
        descripcion: 'programa',
      })
    );
  }

  public clearFilter(inputElement: HTMLInputElement): void {
    inputElement.value = '';
  }

  public getProducto(): void {
    this.utilService.openLoading();
    this.productoService
      .CRUD(
        JSON.stringify({
          par_modo: 'A',
        })
      )
      .subscribe({
        next: (res: any) => {
          let data: IProducto[] = Array.isArray(res.dataset)
            ? (res.dataset as IProducto[])
            : [res.dataset as IProducto];
          this.setProducto(data);
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

  private setProducto(data: IProducto[]): void {
    const modal = this.dialog.open(
      AtributosRelacionCapitaPlanSetProductoDialogComponent,
      {
        data: {
          title: 'SELECCIONE UN PRODUCTO/SUBPRODUCTO',
          data: data,
        },
      }
    );
    modal.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.codigoProducto = res?.producto_administrador;
          this.descripcionProducto.nativeElement.value =
            res?.descripcion_producto_administrador;

          this.codigoSubproducto = res?.codigo_producto;
          this.descripcionSubproducto.nativeElement.value =
            res?.descripcion_producto;
        }
      },
    });
  }

  public clear(
    inputElementOne: HTMLInputElement,
    inputElementTwo: HTMLInputElement
  ): void {
    inputElementOne.value = '';
    inputElementTwo.value = '';
  }
}
