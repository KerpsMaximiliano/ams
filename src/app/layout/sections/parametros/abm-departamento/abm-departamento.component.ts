import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/core/services/util.service';
import { AbmDepartamentoDashboardComponent } from './components/abm-departamento-dashboard/abm-departamento-dashboard.component'; 
import { EditAbmDepartamentoDialogComponent } from './components/edit-abm-departamento-dialog/edit-abm-departamento-dialog.component'; 
import { DepartamentoService } from 'src/app/core/services/abm-departamento.service';
import { AbmDepartamento } from 'src/app/core/models/abm-departamento';

@Component({
  selector: 'app-abm-departamento',
  templateUrl: './abm-departamento.component.html',
  styleUrls: ['./abm-departamento.component.scss']
})
export class AbmDepartamentoComponent {

  @ViewChild(AbmDepartamentoDashboardComponent) dashboard: AbmDepartamentoDashboardComponent;

  constructor(private departamentoService: DepartamentoService,
              private utils: UtilService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
  }

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevoDepartamento(abmdepartamento?:AbmDepartamento): void {
    const modalNuevoAbmDepartamento = this.dialog.open(EditAbmDepartamentoDialogComponent, {
      data: {
        title: `Nuevo Departamento`,
        edit: true,
        letra_provincia: abmdepartamento?.letra_provincia,
        codigo_departamento: abmdepartamento?.codigo_departamento,
        descripcion: abmdepartamento?.descripcion,
        descripcion_reducida: abmdepartamento?.descripcion_reducida,
      }
    });

    modalNuevoAbmDepartamento.afterClosed().subscribe({
      next:(res) => {
        console.log(res);
        
        if (res) {
          this.utils.openLoading();
          this.departamentoService.addDepar(res).subscribe({
            next: (res: any) => {
              this.utils.notification("El Departamento se ha creado exitosamente", 'success')
            },
            error: (err) => {
              this.utils.closeLoading();
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error') 
                : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
              console.log(err.error.returnset.Mensaje);
                this.nuevoDepartamento(res);
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