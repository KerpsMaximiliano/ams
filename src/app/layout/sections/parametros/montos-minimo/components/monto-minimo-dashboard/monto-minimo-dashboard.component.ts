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
import { IMontoMinimo } from 'src/app/core/models/monto-minimo.interface';

// * Material
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-monto-minimo-dashboard',
  templateUrl: './monto-minimo-dashboard.component.html',
  styleUrls: ['./monto-minimo-dashboard.component.scss'],
})
export class MontoMinimoDashboardComponent implements OnInit, OnChanges {
  public displayedColumns = [
    'actividad',
    'seccion',
    'fecha_vigencia',
    'importe_minimo',
    'actions',
  ];
  public dataSource: MatTableDataSource<IMontoMinimo>;

  @Input() public receivedData: IMontoMinimo[];

  @Output() public deleteEvent: EventEmitter<IMontoMinimo> =
    new EventEmitter<IMontoMinimo>();
  @Output() public editEvent: EventEmitter<IMontoMinimo> =
    new EventEmitter<IMontoMinimo>();

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit(): void {
    this.configurePaginator(); 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<IMontoMinimo>(
        this.receivedData
      );
      this.dataSource.paginator = this.paginator;
    }
  }

  public delete(element: IMontoMinimo): void {
    this.deleteEvent.emit(element);
  }

  public edit(element: IMontoMinimo): void {
    this.editEvent.emit(element);
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
