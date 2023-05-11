import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { FormasPagoService } from 'src/app/core/services/formas-pago.service';

// * Interfaces
import { IFormasPago } from 'src/app/core/models/formas-pago.interface';

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

  public nuevaFormaPago(formaPago?: FormasPago): void {
    const modalNuevaFormaPago = this.dialog.open(
      AddEditFormasPagoDialogComponent,
      {
        data: {
          title: `CREAR FORMA DE PAGO`,
          edit: true,
          par_modo: 'I',
          // COMPLETAR
        },
      }
    );

    modalNuevaFormaPago.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.formasPagoService.getEstadoCivilCRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La Forma de Pago se ha creado exitosamente',
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
                    // COMPLETAR
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
