import { Component, Inject, ViewChild } from '@angular/core';

// * Interface
import { IFuenteIngreso } from 'src/app/core/models/fuente-ingreso.interface';

// * Material
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-modal-fuente-ingreso',
  templateUrl: './modal-fuente-ingreso.component.html',
  styleUrls: ['./modal-fuente-ingreso.component.scss'],
})
export class ModalFuenteIngresoComponent {
  // @Input () fuenteIngresos: IFuenteIngreso[];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'codigo_fuente_ingreso',
    'descripcion',
    'actions',
  ];
  dataSource: MatTableDataSource<IFuenteIngreso>;
  fuenteIngresos: IFuenteIngreso[];
  selectedItem: IFuenteIngreso;

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // * Assign the data to the data source for the table to render
    this.getFuenteIngreso();
  }

  // * recupera los datos de fuente de ingreso
  private getFuenteIngreso(): void {
    this.dataSource = new MatTableDataSource<IFuenteIngreso>(this.data.datos);
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // * filtro
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // * guarda el dato seleccionado
  onCheckboxChange(datos: IFuenteIngreso) {
    this.selectedItem = datos;
  }

  selected() {
    this.dialogRef.close(this.selectedItem);
  }
}
