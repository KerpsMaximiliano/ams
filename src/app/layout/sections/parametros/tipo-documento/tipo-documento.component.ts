import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { TipoDocumentoService } from 'src/app/core/services/tipo-documento.service';

// * Interfaces
import { ITipoDocumento } from 'src/app/core/models/tipo-documento.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { AddEditTipoDocumentoDialogComponent } from './components/add-edit-tipo-documento-dialog/add-edit-tipo-documento-dialog.component';
import { TipoDocumentoDashboardComponent } from './components/tipo-documento-dashboard/tipo-documento-dashboard.component';

@Component({
  selector: 'app-tipo-documento',
  templateUrl: './tipo-documento.component.html',
  styleUrls: ['./tipo-documento.component.scss'],
})
export class TipoDocumentoComponent {
  @ViewChild(TipoDocumentoDashboardComponent)
  dashboard: TipoDocumentoDashboardComponent;

  constructor(
    private utils: UtilService,
    private dialog: MatDialog,
    private tipoDocumentoService: TipoDocumentoService
  ) {}

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevoTipoDocumento(documento?: ITipoDocumento): void {
    const modalNuevoTipoDocumento = this.dialog.open(
      AddEditTipoDocumentoDialogComponent,
      {
        data: {
          title: `CREAR TIPO DE DOCUMENTO`,
          edit: true,
          par_modo: 'C',
          tipo_de_documento: documento?.tipo_de_documento,
          descripcion: documento?.descripcion,
          descripcion_reducida: documento?.descripcion_reducida,
          control_cuit: documento?.control_cuit,
        },
      }
    );

    modalNuevoTipoDocumento.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.tipoDocumentoService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'El documento se ha creado exitosamente. ',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión. ', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                    'error'
                  );
              this.nuevoTipoDocumento(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.handleSearch(
                  JSON.stringify({
                    par_modo: 'R',
                    tipo_de_documento: res.tipo_de_documento,
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
