import {
  Component,
  Input,
  ViewChild,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';

// * Interfaces
import { IMovimientoProducto } from 'src/app/core/models/movimiento-producto.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-movimiento-producto-dashboard',
  templateUrl: './movimiento-producto-dashboard.component.html',
  styleUrls: ['./movimiento-producto-dashboard.component.scss'],
})
export class MovimientoProductoDashboardComponent {
  public displayedColumns: string[] = [
    'codigo_motivo',
    'descripcion',
    'tipo_motivo',
    'datos_adicionales',
    'otra_cobertura',
    'actions',
  ];
  public dataSource: MatTableDataSource<IMovimientoProducto>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  @Input() public receivedData: IMovimientoProducto[] = [];
  @Output() public viewEvent: EventEmitter<IMovimientoProducto> =
    new EventEmitter<IMovimientoProducto>();
  @Output() public editEvent: EventEmitter<IMovimientoProducto> =
    new EventEmitter<IMovimientoProducto>();

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}
  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<IMovimientoProducto>(
        this.receivedData
      );
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: IMovimientoProducto): void {
    this.viewEvent.emit(element);
  }

  public edit(element: IMovimientoProducto): void {
    this.editEvent.emit(element);
  }

  calcularTexto(value: string, caso: number): string {
    if (caso === 1) {
      switch (value) {
        case 'N':
          return 'N-NADA';
        case 'F':
          return 'F-FECHA';
        case 'T':
          return 'T-TEXTO';
        case 'S':
          return 'S-SUBMOTIVO';
        default:
          return 'S/N';
      }
    } else {
      switch (value) {
        case 'A':
          return 'A-ALTA';
        case 'B':
          return 'B-BAJA';
        case 'S':
          return 'S-SUSPENDIDO';
        case 'O':
          return 'O-OSP';
        default:
          return 'S/N';
      }
    }
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
