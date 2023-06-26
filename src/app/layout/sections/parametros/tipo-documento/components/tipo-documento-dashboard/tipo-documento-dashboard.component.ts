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
import { ITipoDocumento } from 'src/app/core/models/tipo-documento.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-tipo-documento-dashboard',
  templateUrl: './tipo-documento-dashboard.component.html',
  styleUrls: ['./tipo-documento-dashboard.component.scss'],
})
export class TipoDocumentoDashboardComponent implements OnInit, OnChanges {
  public displayedColumns: string[] = [
    'tipo_de_documento',
    'descripcion',
    'descripcion_reducida',
    'control_cuit',
    'actions',
  ];
  public dataSource: MatTableDataSource<ITipoDocumento>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  @Input() public receivedData: ITipoDocumento[] = [];
  @Output() public viewEvent: EventEmitter<ITipoDocumento> =
    new EventEmitter<ITipoDocumento>();
  @Output() public editEvent: EventEmitter<ITipoDocumento> =
    new EventEmitter<ITipoDocumento>();

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<ITipoDocumento>(
        this.receivedData
      );
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: ITipoDocumento): void {
    this.viewEvent.emit(element);
  }

  public edit(element: ITipoDocumento): void {
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
