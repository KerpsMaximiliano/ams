import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PosicionesService } from 'src/app/core/services/abm-posiciones.service';
import { isNumeric } from 'src/app/core/validators/character.validator';

@Component({
  selector: 'app-abm-posiciones-filter',
  templateUrl: './abm-posiciones-filter.component.html',
  styleUrls: ['./abm-posiciones-filter.component.scss']
})
export class AbmPosicionesFilterComponent {

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  searching = new FormGroup({
    "letra_provincia": new FormControl(),
    "descripcion": new FormControl('')
  })
  utils: any;
  paramProv: any;
  constructor(private posicionesService: PosicionesService,) { }
  
  ngOnInit(): void {
    let bodyprov = {
      par_modo: 'C',
      nombre_provincia:''
    }
    this.posicionesService.getProv(bodyprov).subscribe({
      next:(res) => {this.paramProv = res.dataset
        console.log(res);
      },
      error:(err) => {
        console.log(err);
        (err.status == 0)
          ? this.utils.notification('Error de conexion', 'error') 
          : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
      }
    })
  }

  public search(): void {
    this.searchEvent.emit(this.searching.value)
  }

  public searchid(e: any){
    e.preventDefault();
    this.searchEvent.emit(this.searching.value)
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searching.value)
  }

  public clearInputs(){
    this.searching.value.letra_provincia = '';
    this.searching.value.descripcion = '';
    this.search();
  }
}