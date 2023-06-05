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
    private tipoDocumentoService: TipoDocumentoService,
  ) {}

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevoTipoDocumento(tipoDocumento?: ITipoDocumento): void {
    const modalNuevoTipoDocumento = this.dialog.open(
      AddEditTipoDocumentoDialogComponent,
      {
        data: {
          title: `CREAR TIPO DE DOCUMENTO`,
          edit: true,
          par_modo: 'C',
          tipo: tipoDocumento?.descripcion,
          abreviatura: tipoDocumento?.descripcion_reducida,
          cuit: tipoDocumento?.control_cuit,
          tipo_documento: tipoDocumento?.tipo_de_documento,
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
                'El Documento se ha creado exitosamente. ',
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
                this.handleSearch(res.descripcion.trim());
              }, 300);
            },
          });
        }
      },
    });
  }
}
