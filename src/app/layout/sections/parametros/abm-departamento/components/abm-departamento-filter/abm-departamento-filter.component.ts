import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { isNumeric } from 'src/app/core/validators/character.validator';

@Component({
  selector: 'app-abm-departamento-filter',
  templateUrl: './abm-departamento-filter.component.html',
  styleUrls: ['./abm-departamento-filter.component.scss']
})
export class AbmDepartamentoFilterComponent {

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  searching = new FormGroup({
    "letra_provincia": new FormControl(''),
    "codigo_departamento": new FormControl('')
  })

  constructor() { }

  ngOnInit(): void {
    //  this.setUpForm()
  }



  public search(){
    this.searchEvent.emit(this.searching.value)
  }

  public searchid(e: any){
    e.preventDefault();
    this.searchEvent.emit(this.searching.value)
  }

  public clearInputs(){
    this.searching.value.letra_provincia;
    this.searching.value.codigo_departamento = '';
    this.search();
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searching.value)
  }
}
