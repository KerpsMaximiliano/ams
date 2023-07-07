import {
  Component,
  Input,
  ViewChild,
  OnInit,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';

// * Interfaces
import { IPosicion } from 'src/app/core/models/posicion.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-posicion-dashboard',
  templateUrl: './posicion-dashboard.component.html',
  styleUrls: ['./posicion-dashboard.component.scss'],
})
export class PosicionDashboardComponent implements OnInit, OnChanges {
  public displayedColumns: string[] = [
    'codigo_posicion',
    'descripcion',
    'domicilio',
    'estado',
    'actions',
  ];
  public dataSource: MatTableDataSource<IPosicion>;
  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  @Input() public receivedData: IPosicion[] = [];
  @Output() public viewEvent: EventEmitter<IPosicion> =
    new EventEmitter<IPosicion>();
  @Output() public editEvent: EventEmitter<IPosicion> =
    new EventEmitter<IPosicion>();

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}
  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<IPosicion>(this.receivedData);
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: IPosicion): void {
    this.viewEvent.emit(element);
  }

  public edit(element: IPosicion): void {
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
