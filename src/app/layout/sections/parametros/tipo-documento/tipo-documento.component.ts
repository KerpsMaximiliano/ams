import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild } from '@angular/core';
import { ParametrosService } from 'src/app/core/services/parametros.service';
import { UtilService } from 'src/app/core/services/util.service';
import { AddEditTipoDocumentoDialogComponent } from './components/add-edit-tipo-documento-dialog/add-edit-tipo-documento-dialog.component';
import { TipoDocumentoDashboardComponent } from './components/tipo-documento-dashboard/tipo-documento-dashboard.component';

@Component({
  selector: 'app-tipo-documento',
  templateUrl: './tipo-documento.component.html',
  styleUrls: ['./tipo-documento.component.scss']
})
export class TipoDocumentoComponent {

  @ViewChild(TipoDocumentoDashboardComponent) dashboard: TipoDocumentoDashboardComponent;

  constructor(private parametrosService: ParametrosService,
              private utils: UtilService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
  }

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevoTipoDocumento(): void {
    const modalNuevoTipoDocumento = this.dialog.open(AddEditTipoDocumentoDialogComponent, {
      data: {
        title: `Crear Tipo de Documento`,
        edit: true
      }
    });

    modalNuevoTipoDocumento.afterClosed().subscribe({
      next:(res) => {
        if (res && res.length > 0) {
          this.utils.openLoading();
          this.parametrosService.addParametro(res).subscribe({
            next: (res: any) => {
              this.utils.notification("El Tipo de Documento se ha creado exitosamente", 'success')
            },
            error: (err) => {
              this.utils.closeLoading();
              this.utils.notification(`Error al crear Tipo de Documento: ${err.error.message}`, 'error')
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.handleSearch('');
              }, 300);
            }
          });
        }
      }
    })
  }

}
