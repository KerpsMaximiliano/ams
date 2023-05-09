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
    letra_provincia: new FormControl(''),
    descripcion: new FormControl('')
  })

  constructor() { }

  ngOnInit(): void {
  }

  public search(){
    this.searchEvent.emit(this.searchForm.value)
  }

  public clearInputs(){
    this.searchForm.get('letra_provincia')?.setValue('');
    this.searchForm.get('descripcion')?.setValue('');
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searchForm.value)
  }
}