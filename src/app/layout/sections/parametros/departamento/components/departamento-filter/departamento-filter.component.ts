import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-departamento-filter',
  templateUrl: './departamento-filter.component.html',
  styleUrls: ['./departamento-filter.component.scss']
})
export class DepartamentoFilterComponent {

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  public searchForm: UntypedFormGroup;

  constructor() { }

  ngOnInit(): void {
    this.setUpForm();
  }

  private setUpForm(): void {
    this.searchForm = new UntypedFormGroup({
      letra_provincia: new UntypedFormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
        ])
      ),
      codigo_departamento: new UntypedFormControl(null, Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(2),
        ])
      ),
    })
  }

  public search(){
    let body = {
      par_modo: 'G',
      letra_provincia: this.searchForm.value.letra_provincia.toUpperCase(),
      codigo_departamento: this.searchForm.value.codigo_departamento,
      descripcion: "",
      descripcion_reducida: ""
    }
    this.searchEvent.emit(body)
  }

  public clearInputs(){
    this.searchForm.get('letra_provincia')?.setValue('');
    this.searchForm.get('codigo_departamento')?.setValue(null);
    this.search();
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    let body = {
      par_modo: 'G',
      letra_provincia: this.searchForm.value.letra_provincia.toUpperCase(),
      codigo_departamento: this.searchForm.value.codigo_departamento,
      descripcion: "",
      descripcion_reducida: ""
    }
    this.searchEvent.emit(body)
  }
}