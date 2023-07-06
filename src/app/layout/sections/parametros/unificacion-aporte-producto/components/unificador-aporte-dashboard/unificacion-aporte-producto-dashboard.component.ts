import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

// * Interfaces
import { IUnificacionAporteProducto } from 'src/app/core/models/unificacion-aporte-producto.interface';

// * Material
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-unificacion-aporte-producto-dashboard',
  templateUrl: './unificacion-aporte-producto-dashboard.component.html',
  styleUrls: ['./unificacion-aporte-producto-dashboard.component.scss'],
})
export class UnificacionAporteProductoDashboardComponent {
  @Input() public receivedData: IUnificacionAporteProducto[] = [];

  @Output() public viewEvent: EventEmitter<IUnificacionAporteProducto> =
    new EventEmitter<IUnificacionAporteProducto>();
  @Output() public editEvent: EventEmitter<IUnificacionAporteProducto> =
    new EventEmitter<IUnificacionAporteProducto>();
  @Output() public deletedEvent: EventEmitter<IUnificacionAporteProducto> =
    new EventEmitter<IUnificacionAporteProducto>();

  public displayedColumns = [
    'producto_principal',
    'producto',
    'subproducto_principal',
    'subproducto',
    'actions',
  ];
  public dataSource: MatTableDataSource<IUnificacionAporteProducto>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  constructor(private matPaginatorIntl: MatPaginatorIntl,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<IUnificacionAporteProducto>(this.receivedData);
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: IUnificacionAporteProducto): void {
    this.viewEvent.emit(element);
  }

  public edit(element: IUnificacionAporteProducto): void {
    this.editEvent.emit(element);
  }

  public deleted(element: IUnificacionAporteProducto): void{
    this.deletedEvent.emit(element)
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
