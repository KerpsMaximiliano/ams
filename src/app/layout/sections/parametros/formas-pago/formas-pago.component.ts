import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { FormasPagoService } from 'src/app/core/services/formas-pago.service';

// * Interfaces
import { IFormaPago } from 'src/app/core/models/formas-pago.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { AddEditFormasPagoDialogComponent } from './components/add-edit-formas-pago-dialog/add-edit-formas-pago-dialog.component';
import { FormasPagoDashboardComponent } from './components/formas-pago-dashboard/formas-pago-dashboard.component';

@Component({
  selector: 'app-formas-pago',
  templateUrl: './formas-pago.component.html',
  styleUrls: ['./formas-pago.component.scss'],
})
export class FormasPagoComponent {
  @ViewChild(FormasPagoDashboardComponent)
  dashboard: FormasPagoDashboardComponent;

  constructor(
    private formasPagoService: FormasPagoService,
    private utils: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevaFormaPago(formaPago?: IFormaPago): void {
    const modalNuevaFormaPago = this.dialog.open(
      AddEditFormasPagoDialogComponent,
      {
        data: {
          title: `CREAR FORMA DE PAGO`,
          edit: true,
          par_modo: 'I',
          forma_pago: formaPago?.forma_pago,
          codigo: 0,
          description: formaPago?.description,
          solicita_datos_ad: formaPago?.solicita_datos_ad,
          codigo_banco: formaPago?.codigo_banco,
          trabaja_archivos: formaPago?.trabaja_archivos,
          trabaja_rechazos: formaPago?.trabaja_rechazos,
          nombre_tarjeta_nemot: formaPago?.nombre_tarjeta_nemot,
          codigo_tarjeta_de_baja: '',
        },
      }
    );

    modalNuevaFormaPago.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.formasPagoService.getFormasPagoCRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La Forma de Pago se ha creado exitosamente.',
                'success'
              );
            },
            error: (err: any) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión.', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`,
                    'error'
                  );
              this.nuevaFormaPago(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.handleSearch(
                  JSON.stringify({
                    par_modo: 'C',
                    description: '',
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
