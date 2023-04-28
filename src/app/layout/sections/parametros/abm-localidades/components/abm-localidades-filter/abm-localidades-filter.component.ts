import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LocalidadesService } from 'src/app/core/services/abm-localidades.service';
import { UtilService } from 'src/app/core/services/util.service';
import { isAlphanumeric, isAlphanumericWithSpaces, isNumeric } from 'src/app/core/validators/character.validator';

@Component({
  selector: 'app-abm-localidades-filter',
  templateUrl: './abm-localidades-filter.component.html',
  styleUrls: ['./abm-localidades-filter.component.scss']
})
export class AbmLocalidadesFilterComponent {

  paramDepto:[]| any;
  paramProv:[]| any;
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  searching = new FormGroup({
    "codigo_postal": new FormControl(''),
    "letra_provincia": new FormControl(''),
    "codigo_departamento": new FormControl(''),
    "descripcion": new FormControl('')
  })
  constructor(private LocalidadesService: LocalidadesService,
    private utils: UtilService,
    ) { }

  ngOnInit() {
    let bodyprov = {
      par_modo: 'C',
      nombre_provincia:''
    }
    this.LocalidadesService.getProvincia(bodyprov).subscribe({
      next:(res) => {this.paramProv = res.dataset
      },
      error:(err) => {
        console.log(err);
        (err.status == 0)
          ? this.utils.notification('Error de conexion', 'error') 
          : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
      }
    })
  }

  public search(){
    this.searchEvent.emit(this.searching.value)
  }

  buscar(letra_provincia:string){    
    let bodydep = {
      par_modo: 'C',
      descripcion:'',
      letra_provincia:letra_provincia
    }
    this.LocalidadesService.getDepart(bodydep).subscribe({
      next:(res) => {this.paramDepto = res.dataset
      },
      error:(err) => {
        console.log(err);
        (err.status == 0)
          ? this.utils.notification('Error de conexion', 'error') 
          : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
      }
    })
  }

  public searchid(e: any){
    e.preventDefault();
    this.searchEvent.emit(this.searching.value)
  }

  public clearInputs(){
    this.searching.get('codigo_postal')?.setValue(''),
    this.searching.get('letra_provincia')?.setValue(''),
    this.searching.get('codigo_departamento')?.setValue(''),
    this.searching.get('descripcion')?.setValue('')
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searching.value)
  }
}
