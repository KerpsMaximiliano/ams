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
import { ISubMotivoMovimientoProducto } from 'src/app/core/models/sub-motivo-movimiento.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-sub-motivo-movimiento-producto-dashboard',
  templateUrl: './sub-motivo-movimiento-producto-dashboard.component.html',
  styleUrls: ['./sub-motivo-movimiento-producto-dashboard.component.scss'],
})
export class SubMotivoMovimientoProductoDashboardComponent implements OnInit, OnChanges {
  public displayedColumns: string[] = [
    'codigo_submotivo',
    'descripcion',
    'estado',
    'actions',
  ];
  public dataSource: MatTableDataSource<ISubMotivoMovimientoProducto>;
  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  @Input() public receivedData: ISubMotivoMovimientoProducto[] = [];
  @Output() public viewEvent: EventEmitter<ISubMotivoMovimientoProducto> =
    new EventEmitter<ISubMotivoMovimientoProducto>();
  @Output() public editEvent: EventEmitter<ISubMotivoMovimientoProducto> =
    new EventEmitter<ISubMotivoMovimientoProducto>();

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}
  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<ISubMotivoMovimientoProducto>(
        this.receivedData
      );
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: ISubMotivoMovimientoProducto): void {
    this.viewEvent.emit(element);
  }

  public edit(element: ISubMotivoMovimientoProducto): void {
    this.editEvent.emit(element);
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
