import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { EmpresaFacturaService } from 'src/app/core/services/empresa-factura.service';

// * Interfaces
import { IEmpresaFactura } from 'src/app/core/models/empresa-factura.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { EmpresaFacturaFilterComponent } from './components/empresa-factura-filter/empresa-factura-filter.component';
import { EmpresaFacturaDashboardComponent } from './components/empresa-factura-dashboard/empresa-factura-dashboard.component';
import { AddEditEmpresaFacturaComponent } from './components/add-edit-empresa-factura/add-edit-empresa-factura.component';

@Component({
  selector: 'app-empresa-factura',
  templateUrl: './empresa-factura.component.html',
  styleUrls: ['./empresa-factura.component.scss'],
})
export class EmpresaFacturaComponent {
  @ViewChild(EmpresaFacturaFilterComponent)
  filter: EmpresaFacturaFilterComponent;
  @ViewChild(EmpresaFacturaDashboardComponent)
  dashboard: EmpresaFacturaDashboardComponent;

  constructor(
    private _empresaFacturaService: EmpresaFacturaService,
    private utils: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevaEmpresaFactura(empresaFactura?: IEmpresaFactura): void {
    const modalNuevaEmpresaFactura = this.dialog.open(
      AddEditEmpresaFacturaComponent,
      {
        data: {
          title: `CREAR NUEVA EMPRESA QUE FACTURA`,
          edit: true,
          par_modo: 'C',
          id_empresa: empresaFactura?.id_empresa,
          descripcion: empresaFactura?.descripcion,
          calle: empresaFactura?.calle,
          nro_puerta: empresaFactura?.nro_puerta,
          piso: empresaFactura?.piso,
          departamento: empresaFactura?.departamento,
          codigo_postal: empresaFactura?.codigo_postal,
          sub_codigo_postal: empresaFactura?.sub_codigo_postal,
          nro_tel: empresaFactura?.nro_tel,
          nro_fax: empresaFactura?.nro_fax,
          email: empresaFactura?.email,
          codigo_iva: empresaFactura?.codigo_iva,
          cuit: empresaFactura?.cuit,
          fecha_vto_cuit: empresaFactura?.fecha_vto_cuit,
          moneda1: empresaFactura?.moneda1,
          ref_contable_acreedora1: empresaFactura?.ref_contable_acreedora1,
          moneda2: empresaFactura?.moneda2,
          ref_contable_acreedora2: empresaFactura?.ref_contable_acreedora2,
          cta_banco_ams: empresaFactura?.cta_banco_ams,
          campo_desc1: empresaFactura?.campo_desc1,
          campo_desc2: empresaFactura?.campo_desc2,
          comprobante_generar: empresaFactura?.comprobante_generar,
          codigo_sicone: empresaFactura?.codigo_sicone,
          gen_min_como_empr: empresaFactura?.gen_min_como_empr,
          codigo_postal_arg: empresaFactura?.codigo_postal_arg,
          nro_inscripcion_igb: empresaFactura?.nro_inscripcion_igb,
          fecha_inicio_act: empresaFactura?.fecha_inicio_act,
          trabaja_ref_cont: empresaFactura?.trabaja_ref_cont,
          fact_cr_elec: empresaFactura?.fact_cr_elec,
          cbu_nro: empresaFactura?.cbu_nro,
        },
      }
    );

    modalNuevaEmpresaFactura.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this._empresaFacturaService
            .CRUD(JSON.stringify(res.datos))
            .subscribe({
              next: () => {
                this.utils.notification(
                  'La extencion de fuente de ingreso se ha creado exitosamente. ',
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
                this.nuevaEmpresaFactura(res);
              },
              complete: () => {
                this.utils.closeLoading();
                if (res.reload) {
                  this.nuevaEmpresaFactura();
                }
              },
            });
        }
      },
    });
  }
}
