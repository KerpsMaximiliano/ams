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
import { IEstadoCivil } from 'src/app/core/models/estado-civil.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-estado-civil-dashboard',
  templateUrl: './estado-civil-dashboard.component.html',
  styleUrls: ['./estado-civil-dashboard.component.scss'],
})
export class EstadoCivilDashboardComponent implements OnInit, OnChanges {
  @Input() public receivedData: IEstadoCivil[] = [];

  @Output() public viewEvent: EventEmitter<IEstadoCivil> =
    new EventEmitter<IEstadoCivil>();
  @Output() public editEvent: EventEmitter<IEstadoCivil> =
    new EventEmitter<IEstadoCivil>();

  public displayedColumns: string[] = [
    'codigo_estado_civil',
    'description',
    'actions',
  ];
  public dataSource: MatTableDataSource<IEstadoCivil>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<IEstadoCivil>(this.receivedData);
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: IEstadoCivil): void {
    this.viewEvent.emit(element);
  }

  public edit(element: IEstadoCivil): void {
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
