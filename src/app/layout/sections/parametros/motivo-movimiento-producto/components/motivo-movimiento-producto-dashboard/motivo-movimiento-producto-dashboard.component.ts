import {
  Component,
  Input,
  ViewChild,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';

// * Interfaces
import { IMotivoMovimientoProducto } from 'src/app/core/models/motivo-movimiento-producto.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-motivo-movimiento-producto-dashboard',
  templateUrl: './motivo-movimiento-producto-dashboard.component.html',
  styleUrls: ['./motivo-movimiento-producto-dashboard.component.scss'],
})
export class MotivoMovimientoProductoDashboardComponent {
  public displayedColumns: string[] = [
    'codigo_motivo',
    'descripcion',
    'tipo_motivo',
    'datos_adicionales',
    'otra_cobertura',
    'actions',
  ];
  public dataSource: MatTableDataSource<IMotivoMovimientoProducto>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  @Input() public receivedData: IMotivoMovimientoProducto[] = [];
  @Output() public viewEvent: EventEmitter<IMotivoMovimientoProducto> =
    new EventEmitter<IMotivoMovimientoProducto>();
  @Output() public editEvent: EventEmitter<IMotivoMovimientoProducto> =
    new EventEmitter<IMotivoMovimientoProducto>();

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<IMotivoMovimientoProducto>(
        this.receivedData
      );
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: IMotivoMovimientoProducto): void {
    this.viewEvent.emit(element);
  }

  public edit(element: IMotivoMovimientoProducto): void {
    this.editEvent.emit(element);
  }

  public text(value: string, type: boolean): string {
    if (type) {
      switch (value) {
        case 'N':
          return 'NADA';
        case 'F':
          return 'FECHA';
        case 'T':
          return 'TEXTO';
        case 'S':
          return 'SUBMOTIVO';
        default:
          return 'S/N';
      }
    } else {
      switch (value) {
        case 'A':
          return 'ALTA';
        case 'B':
          return 'BAJA';
        case 'S':
          return 'SUSPENDIDO';
        case 'O':
          return 'OSP';
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
