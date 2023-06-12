import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { ProductoService } from 'src/app/core/services/producto.service';

// * Interfaces
import { IProducto } from 'src/app/core/models/producto.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { AddEditProductoDialogComponent } from './components/add-edit-producto-dialog/add-edit-producto-dialog.component';
import { ProductoDashboardComponent } from './components/producto-dashboard/producto-dashboard.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
})
export class ProductoComponent {
  @ViewChild(ProductoDashboardComponent)
  dashboard: ProductoDashboardComponent;

  constructor(
    private productoService: ProductoService,
    private utils: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevoProducto(producto?: IProducto): void {
    const modalNuevoProducto = this.dialog.open(
      AddEditProductoDialogComponent,
      {
        data: {
          title: `CREAR PRODUCTO`,
          edit: true,
          par_modo: 'I',
          codigo_producto: producto?.codigo_producto,
          descripcion_producto: producto?.descripcion_producto,
          descripcion_reducida: producto?.descripcion_reducida,
          tipo_producto: producto?.tipo_producto,
          administrado: producto?.administrado,
          clase_producto: producto?.clase_producto,
          codigo_fuente_ingreso: producto?.codigo_fuente_ingreso,
          empresa: producto?.empresa,
          obra_social: producto?.obra_social,
        },
      }
    );

    modalNuevoProducto.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.productoService.getProductoCRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'El Producto se ha creado exitosamente.',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión.', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                    'error'
                  );
              this.nuevoProducto(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.handleSearch(
                  JSON.stringify({
                    par_modo: 'C',
                    descripcion: '',
                  })
                );
              }, 300);
            },
          });
        }
      },
    });
  }
}
