import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { AtributosRelacionCapitaPlanService } from 'src/app/core/services/atributos-relacion-capita-plan.service';

// * Interfaces
import { IAtributosRelacionCapitaPlan } from 'src/app/core/models/atributos-relacion-capita-plan.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { AddEditAtributosRelacionCapitaPlanDialogComponent } from './components/add-edit-atributos-relacion-capita-plan-dialog/add-edit-atributos-relacion-capita-plan-dialog.component';
import { AtributosRelacionCapitaPlanDashboardComponent } from './components/atributos-relacion-capita-plan-dashboard/atributos-relacion-capita-plan-dashboard.component';

@Component({
  selector: 'app-atributos-relacion-capita-plan',
  templateUrl: './atributos-relacion-capita-plan.component.html',
  styleUrls: ['./atributos-relacion-capita-plan.component.scss'],
})
export class AtributosRelacionCapitaPlanComponent {
  @ViewChild(AtributosRelacionCapitaPlanDashboardComponent)
  dashboard: AtributosRelacionCapitaPlanDashboardComponent;

  constructor(
    private AtributosRelacionCapitaPlanService: AtributosRelacionCapitaPlanService,
    private utils: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevosAtributosRelacionCapitaPlan(atributosRelacionCapitaPlan?: IAtributosRelacionCapitaPlan): void {
    const modalNuevosAtributosRelacionCapitaPlan = this.dialog.open(
      AddEditAtributosRelacionCapitaPlanDialogComponent,
      {
        data: {
          title: `CREAR `, // * VERIFICAR
          edit: true,
          par_modo: '', // * VERIFICAR
        },
      }
    );
    modalNuevosAtributosRelacionCapitaPlan.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.AtributosRelacionCapitaPlanService.getAtributosRelacionCapitaPlanCRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'Los Atributos de Relación Capita/Plan se ha creado exitosamente.',
                'success'
              );
            },
            error: (err: any) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión.', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                    'error'
                  );
              this.nuevosAtributosRelacionCapitaPlan(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.handleSearch(
                  JSON.stringify({
                    par_modo: 'C', // * VERIFICAR
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
