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
import { IPreguntaDDJJ } from 'src/app/core/models/pregunta-ddjj.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-pregunta-ddjj-dashboard',
  templateUrl: './pregunta-ddjj-dashboard.component.html',
  styleUrls: ['./pregunta-ddjj-dashboard.component.scss'],
})
export class PreguntaDDJJDashboardComponent implements OnInit, OnChanges {
  public displayedColumns: string[] = [
    'nro_preg',
    'primer_texto_preg',
    'segundo_texto_preg',
    'pide_fecha',
    'yes_no',
    'actions',
  ];
  public dataSource: MatTableDataSource<IPreguntaDDJJ>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  @Input() public receivedData: IPreguntaDDJJ[] = [];
  @Output() public viewEvent: EventEmitter<IPreguntaDDJJ> =
    new EventEmitter<IPreguntaDDJJ>();
  @Output() public editEvent: EventEmitter<IPreguntaDDJJ> =
    new EventEmitter<IPreguntaDDJJ>();

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<IPreguntaDDJJ>(
        this.receivedData
      );
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: IPreguntaDDJJ): void {
    this.viewEvent.emit(element);
  }

  public edit(element: IPreguntaDDJJ): void {
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
