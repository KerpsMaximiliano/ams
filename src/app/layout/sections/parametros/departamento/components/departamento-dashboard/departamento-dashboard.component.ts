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
import { IDepartamento } from 'src/app/core/models/departamento.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-departamento-dashboard',
  templateUrl: './departamento-dashboard.component.html',
  styleUrls: ['./departamento-dashboard.component.scss'],
})
export class DepartamentoDashboardComponent implements OnInit, OnChanges {
  @Input() public receivedData: IDepartamento[] = [];

  @Output() public viewEvent: EventEmitter<IDepartamento> =
    new EventEmitter<IDepartamento>();
  @Output() public editEvent: EventEmitter<IDepartamento> =
    new EventEmitter<IDepartamento>();

  public displayedColumns: string[] = [
    'codigo_departamento',
    'descripcion',
    'descripcion_reducida',
    'actions',
  ];
  public dataSource: MatTableDataSource<IDepartamento>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}
  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<IDepartamento>(
        this.receivedData
      );
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: IDepartamento): void {
    this.viewEvent.emit(element);
  }

  public edit(element: IDepartamento): void {
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
