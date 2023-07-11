import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

// * Interfaces
import { IUnificacionAporteProducto } from 'src/app/core/models/unificacion-aporte-producto.interface';

// * Material
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-unificacion-aporte-producto-dashboard',
  templateUrl: './unificacion-aporte-producto-dashboard.component.html',
  styleUrls: ['./unificacion-aporte-producto-dashboard.component.scss'],
})
export class UnificacionAporteProductoDashboardComponent
  implements OnInit, OnChanges
{
  public displayedColumns = [
    'producto_secundario',
    'producto_principal_descripcion',
    'subproducto_secundario',
    'subproducto_principal_descripcion',
    'unifica_aportes',
    'actions',
  ];
  public dataSource: MatTableDataSource<IUnificacionAporteProducto>;

  @Input() public receivedData: IUnificacionAporteProducto[];

  @Output() public deleteEvent: EventEmitter<IUnificacionAporteProducto> =
    new EventEmitter<IUnificacionAporteProducto>();

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit(): void {
    this.configurePaginator();
    this.dataSource = new MatTableDataSource<IUnificacionAporteProducto>(
      this.receivedData
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      console.log(this.receivedData);

      this.dataSource = new MatTableDataSource<IUnificacionAporteProducto>(
        this.receivedData
      );
      this.dataSource.paginator = this.paginator;
    }
  }

  public delete(element: IUnificacionAporteProducto): void {
    this.deleteEvent.emit(element);
  }

  private configurePaginator(): void {
    this.paginator._intl = this.matPaginatorIntl;
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página: ';
    this.paginator._intl.nextPageLabel = 'Página siguiente.';
    this.paginator._intl.previousPageLabel = 'Página anterior.';
    this.paginator._intl.firstPageLabel = 'Primer página.';
    this.paginator._intl.lastPageLabel = 'Última página.';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ): string => {
      return length
        ? `Página ${page + 1} de ${Math.ceil(length / pageSize)}`
        : 'Página 0 de 0';
    };
  }
}
