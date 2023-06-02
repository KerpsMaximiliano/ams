import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FuenteIngresoService } from 'src/app/core/services/fuente-ingreso.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-fuente-ingreso-filter',
  templateUrl: './fuente-ingreso-filter.component.html',
  styleUrls: ['./fuente-ingreso-filter.component.scss']
})

export class FuenteIngresoFilterComponent {
  

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  searchForm = new FormGroup({
    descripcion: new FormControl(''),
    empresa_asociada: new FormControl('')
  })
  listEmpresas: any[];
  listIngrasos: any[];

  constructor( public fuentesIngresoService: FuenteIngresoService,
    private utils: UtilService) {
  }
  
  ngOnInit() {
    this.cargaDatos('E', 'listEmpresas');
  }

  cargaDatos(dato: string, consulta: string){
    let body =
    {
      par_modo: dato
    }
    console.log(dato)
    this.fuentesIngresoService.fuenteIngresoCRUD(JSON.stringify(body)).subscribe({
      next:(res:any) => {
        if (consulta == 'listEmpresas'){
          this.listEmpresas =  res.dataset;
          console.log(this.listEmpresas);
        }
        else if (consulta == 'listIngreso'){
          this.listIngrasos =  res.dataset;
          console.log(this.listIngrasos);
        }
      },
      error:(err: any) => {
        console.log(err);
        (err.status == 0)
          ? this.utils.notification('Error de conexion', 'error') 
          : this.utils.notification(`Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`, 'error')
      }
    })
  }

  public search(){
    this.searchEvent.emit(this.searchForm.value)
  }

  public clearInputs(){
    this.searchForm.get('descripcion')?.setValue('');
    this.searchForm.get('empresa_asociada')?.setValue('');
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searchForm.value)
  }
}
