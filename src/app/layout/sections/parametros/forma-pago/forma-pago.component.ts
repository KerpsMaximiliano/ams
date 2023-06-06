import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { FormaPagoService } from 'src/app/core/services/forma-pago.service';

// * Interfaces
import { IFormaPago } from 'src/app/core/models/formas-pago.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { AddEditFormaPagoDialogComponent } from './components/add-edit-forma-pago-dialog/add-edit-forma-pago-dialog.component';
import { FormaPagoDashboardComponent } from './components/forma-pago-dashboard/forma-pago-dashboard.component';

@Component({
  selector: 'app-forma-pago',
  templateUrl: './forma-pago.component.html',
  styleUrls: ['./forma-pago.component.scss'],
})
export class FormaPagoComponent {
  @ViewChild(FormaPagoDashboardComponent)
  dashboard: FormaPagoDashboardComponent;

  constructor(
    private utils: UtilService,
    private dialog: MatDialog,
    private formaPagoService: FormaPagoService
  ) {}

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevaFormaPago(formaPago?: IFormaPago): void {
    const modalNuevaFormaPago = this.dialog.open(
      AddEditFormaPagoDialogComponent,
      {
        data: {
          title: `CREAR FORMA DE PAGO`,
          edit: true,
          par_modo: 'C',
          codigo: formaPago?.codigo,
          forma_pago: formaPago?.forma_pago,
          description: formaPago?.description,
          nombre_tarjeta_nemot: formaPago?.nombre_tarjeta_nemot,
          codigo_banco: formaPago?.codigo_banco,
          trabaja_archivos: formaPago?.trabaja_archivos,
          trabaja_rechazos: formaPago?.trabaja_rechazos,
          solicita_datos_ad: formaPago?.solicita_datos_ad,
          codigo_tarjeta_de_baja: '',
        },
      }
    );

    modalNuevaFormaPago.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.formaPagoService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La forma de pago se ha creado exitosamente. ',
                'success'
              );
            },
            error: (err: any) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión. ', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
                    'error'
                  );
              this.nuevaFormaPago(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.handleSearch(
                  JSON.stringify({
                    par_modo: 'R',
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
