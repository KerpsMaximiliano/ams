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
import { INacionalidad } from 'src/app/core/models/nacionalidad.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-nacionalidad-dashboard',
  templateUrl: './nacionalidad-dashboard.component.html',
  styleUrls: ['./nacionalidad-dashboard.component.scss'],
})
export class NacionalidadDashboardComponent implements OnInit, OnChanges {
  public displayedColumns: string[] = [
    'codigo_nacionalidad_nuevo',
    'descripcion',
    'codigo_sistema_anterior',
    'actions',
  ];
  public dataSource: MatTableDataSource<INacionalidad>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  @Input() public receivedData: INacionalidad[] = [];
  @Output() public viewEvent: EventEmitter<INacionalidad> =
    new EventEmitter<INacionalidad>();
  @Output() public editEvent: EventEmitter<INacionalidad> =
    new EventEmitter<INacionalidad>();

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<INacionalidad>(
        this.receivedData
      );
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: INacionalidad): void {
    this.viewEvent.emit(element);
  }

  public edit(element: INacionalidad): void {
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
