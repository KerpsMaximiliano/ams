import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { EmpresaFacturaService } from 'src/app/core/services/empresa-factura.service';
// * Interfaces
import { IEmpresaFactura } from 'src/app/core/models/empresa-factura.interface';
// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
// * Components
import { AddEditEmpresaFacturaComponent } from '../add-edit-empresa-factura/add-edit-empresa-factura.component';

@Component({
  selector: 'app-empresa-factura-dashboard',
  templateUrl: './empresa-factura-dashboard.component.html',
  styleUrls: ['./empresa-factura-dashboard.component.scss'],
})
export class EmpresaFacturaDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);

  public searchValue: any;
  public fuenteingreso: IEmpresaFactura[] = [];
  public displayedColumns: string[] = ['codigo', 'name', 'actions'];
  public dataSource: MatTableDataSource<IEmpresaFactura>;

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private _empresaFacturaService: EmpresaFacturaService
  ) {}

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página: ';
    this.paginator._intl.nextPageLabel = 'Página siguiente.';
    this.paginator._intl.previousPageLabel = 'Página anterior.';
    this.paginator._intl.firstPageLabel = 'Primer página.';
    this.paginator._intl.lastPageLabel = 'Ultima página.';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ): string => {
      return length
        ? 'Página ' + (page + 1) + ' de ' + Math.ceil(length / pageSize)
        : 'Página 0 de 0';
    };
  }

  private getEmpresaFactura(): void {
    this.utils.openLoading();
    console.log(this.searchValue);

    this._empresaFacturaService.CRUD(this.searchValue).subscribe({
      next: (res: any) => {
        console.log(res);

        res.dataset.length
          ? (this.fuenteingreso = res.dataset as IEmpresaFactura[])
          : (this.fuenteingreso = [res.dataset]);
        this.dataSource = new MatTableDataSource<IEmpresaFactura>(
          this.fuenteingreso
        );
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        this.utils.closeLoading();
        err.status == 0
          ? this.utils.notification('Error de conexión. ', 'error')
          : this.utils.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
      },
      complete: () => {
        this.utils.closeLoading();
      },
    });
  }

  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public editEmpresaFactura(empresaFactura: IEmpresaFactura): void {
    const modalNuevaEmpresaFactura = this.dialog.open(
      AddEditEmpresaFacturaComponent,
      {
        data: {
          title: `EDITAR EMPRESA QUE FACTURA`,
          edit: true,
          par_modo: 'U',
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
          this._empresaFacturaService.CRUD(res.datos).subscribe({
            next: () => {
              this.utils.notification(
                'La extencion de fuente de ingreso se ha editado extiosamente. ',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión. ', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
                    'error'
                  );
              this.editEmpresaFactura(res);
            },
            complete: () => {
              this.utils.closeLoading();
              this.getEmpresaFactura();
            },
          });
        }
      },
    });
  }

  public viewEmpresaFactura(empresaFactura: IEmpresaFactura): void {
    this.dialog.open(AddEditEmpresaFacturaComponent, {
      data: {
        title: `VER EMPRESA QUE FACTURA`,
        edit: false,
        par_modo: 'R',
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
    });
  }

  public filter(data: string): void {
    this.searchValue = data;
    this.getEmpresaFactura();
  }
}
