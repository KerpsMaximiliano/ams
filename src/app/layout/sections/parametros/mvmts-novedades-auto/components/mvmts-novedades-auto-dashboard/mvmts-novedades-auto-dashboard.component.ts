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

// * Animations
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

// * Interfaces
import { IMvmtsNovedadesAuto } from 'src/app/core/models/mvmts-novedades-auto.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-mvmts-novedades-auto-dashboard',
  templateUrl: './mvmts-novedades-auto-dashboard.component.html',
  styleUrls: ['./mvmts-novedades-auto-dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ]
})
export class MvmtsNovedadesAutoDashboardComponent implements OnInit, OnChanges {
  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  @Input() public receivedData: IMvmtsNovedadesAuto[] = [];

  @Output() private viewEvent: EventEmitter<IMvmtsNovedadesAuto> =
    new EventEmitter<IMvmtsNovedadesAuto>();
  @Output() private editEvent: EventEmitter<IMvmtsNovedadesAuto> =
    new EventEmitter<IMvmtsNovedadesAuto>();

  public displayedColumns: string[] = [
    'capita_origen',
    'producto_origen',
    'sub_producto_origen',
    'plan_origen',
    'capita_rel',
    'actions',
  ];  
  public columnsToDisplayWithExpand = [...this.displayedColumns];
  public expandedElement: any | null;
  public dataSource: MatTableDataSource<IMvmtsNovedadesAuto>;

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}
  
  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<IMvmtsNovedadesAuto>(this.receivedData);
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: IMvmtsNovedadesAuto): void {
    this.viewEvent.emit(element);
  }

  public edit(element: IMvmtsNovedadesAuto): void {
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
