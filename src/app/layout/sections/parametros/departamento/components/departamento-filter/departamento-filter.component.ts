import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProvinciaResponse } from 'src/app/core/models/provincia';

@Component({
  selector: 'app-departamento-filter',
  templateUrl: './departamento-filter.component.html',
  styleUrls: ['./departamento-filter.component.scss']
})
export class DepartamentoFilterComponent {

  @Input() provincias$: Observable<ProvinciaResponse>;
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  searchForm = new FormGroup({
    selectedProvincia: new FormControl(''),
    codigoDepartamento: new FormControl(null)
  })

  constructor() { }

  ngOnInit(): void {
  }

  public search(){    
    let body = {
      par_modo: 'G',
      letra_provincia: this.searchForm.get('selectedProvincia')?.value?.toUpperCase(),
      codigo_departamento: this.searchForm.get('codigoDepartamento')?.value,
      descripcion: "",
      descripcion_reducida: ""
    };
    this.searchEvent.emit(body)
  }

  public clearInputs(){
    this.searchForm.get('selectedProvincia')?.setValue('');
    this.searchForm.get('codigoDepartamento')?.setValue(null);
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    let body = {
      par_modo: 'G',
      letra_provincia: this.searchForm.get('selectedProvincia')?.value?.toUpperCase(),
      codigo_departamento: this.searchForm.get('codigoDepartamento')?.value,
      descripcion: "",
      descripcion_reducida: ""
    }
    this.searchEvent.emit(body)
  }
}