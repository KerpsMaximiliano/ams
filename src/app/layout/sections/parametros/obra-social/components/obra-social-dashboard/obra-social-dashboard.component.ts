import {
  Component,
  Input,
  ViewChild,
  SimpleChanges,
  EventEmitter,
  Output,
  OnChanges,
  OnInit,
} from '@angular/core';

// * Interfaces
import { IObraSocial } from 'src/app/core/models/obra-social.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-obra-social-dashboard',
  templateUrl: './obra-social-dashboard.component.html',
  styleUrls: ['./obra-social-dashboard.component.scss'],
})
export class ObraSocialDashboardComponent implements OnInit, OnChanges {
  public displayedColumns: string[] = [
    'codigo',
    'descripcion',
    'tipo_obra_social_prepaga',
    'nro_registro',
    'similar_SMP',
    'omite_R420',
    'actions',
  ];
  public dataSource: MatTableDataSource<IObraSocial>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  @Input() public receivedData: IObraSocial[] = [];
  @Output() public viewEvent: EventEmitter<IObraSocial> =
    new EventEmitter<IObraSocial>();
  @Output() public editEvent: EventEmitter<IObraSocial> =
    new EventEmitter<IObraSocial>();

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<IObraSocial>(this.receivedData);
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: IObraSocial): void {
    this.viewEvent.emit(element);
  }

  public edit(element: IObraSocial): void {
    this.editEvent.emit(element);
  }

  public getTipo(tipo: string): string {
    switch (tipo) {
      case 'O':
        return 'OBRA SOCIAL';
      case 'P':
        return 'PREPAGA';
      case 'A':
        return 'AMBAS';
      default:
        return '';
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
