import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UtilService } from 'src/app/core/services/util.service';
import { DepartamentoService } from 'src/app/core/services/abm-departamento.service';


@Component({
  selector: 'app-abm-departamento-filter',
  templateUrl: './abm-departamento-filter.component.html',
  styleUrls: ['./abm-departamento-filter.component.scss']
})
export class AbmDepartamentoFilterComponent {

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  searching = new FormGroup({
    "letra_provincia": new FormControl(''),
    "descripcion": new FormControl('')
  })
  paramProv: any;

  constructor(
    private utils: UtilService,
    private DepartamentoService: DepartamentoService,
    
  ) { }

  ngOnInit(): void {
    let bodyprov = {
      par_modo: 'C',
      nombre_provincia:''
    }
    this.utils.openLoading();
    this.DepartamentoService.getProvincia(bodyprov).subscribe({
      next:(res) => {this.paramProv = res.dataset
      },
      error:(err) => {
        console.log(err);
        (err.status == 0)
          ? this.utils.notification('Error de conexion', 'error') 
          : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
      }
    })
    this.utils.closeLoading();
  }



  public search(){
    this.searchEvent.emit(this.searching.value)
  }

  public searchid(e: any){
    e.preventDefault();
    this.searchEvent.emit(this.searching.value)
  }

  public clearInputs(){
    this.searching.get('letra_provincia')?.setValue(''),
    this.searching.get('descripcion')?.setValue(''),
    this.search();
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searching.value)
  }
}
