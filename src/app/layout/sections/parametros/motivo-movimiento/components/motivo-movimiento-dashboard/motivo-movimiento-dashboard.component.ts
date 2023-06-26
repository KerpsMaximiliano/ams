import {
  Component,
  Input,
  ViewChild,
  SimpleChanges,
  EventEmitter,
  Output,
  OnInit,
  OnChanges,
} from '@angular/core';

// * Interfaces
import { IMotivoMovimiento } from 'src/app/core/models/motivo-movimiento.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-motivo-movimiento-dashboard',
  templateUrl: './motivo-movimiento-dashboard.component.html',
  styleUrls: ['./motivo-movimiento-dashboard.component.scss'],
})
export class MotivoMovimientoDashboardComponent implements OnInit, OnChanges {
  public displayedColumns: string[] = [
    'id_motivo',
    'descripcion',
    'tipo_motivo',
    'datos_adic_SN',
    'fecha_inicio_vigencia',
    'estado',
    'actions',
  ];
  public dataSource: MatTableDataSource<IMotivoMovimiento>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  @Input() public receivedData: IMotivoMovimiento[] = [];
  @Output() public viewEvent: EventEmitter<IMotivoMovimiento> =
    new EventEmitter<IMotivoMovimiento>();
  @Output() public editEvent: EventEmitter<IMotivoMovimiento> =
    new EventEmitter<IMotivoMovimiento>();
  searchValue: string;

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<IMotivoMovimiento>(
        this.receivedData
      );
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: IMotivoMovimiento): void {
    this.viewEvent.emit(element);
  }

  public edit(element: IMotivoMovimiento): void {
    this.editEvent.emit(element);
  }

  public calcularValor(valor: string): string {
    switch (valor) {
      case 'B':
        return 'B-BAJA';
      case 'A':
        return 'A-ALTA';
      case 'S':
        return 'S-SUSPENSIÓN';
      case 'O':
        return 'O-OSP';
      default:
        return 'S/N';
    }
  }

  public calcularFecha(fecha: number) {
    const newFecha = fecha.toString();
    if (fecha != null) {
      return (
        newFecha.slice(6, 8) +
        '/' +
        newFecha.slice(4, 6) +
        '/' +
        newFecha.slice(0, 4)
      );
    } else {
      return null;
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
