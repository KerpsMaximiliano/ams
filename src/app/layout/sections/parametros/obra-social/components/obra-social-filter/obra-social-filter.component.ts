import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-obra-social-filter',
  templateUrl: './obra-social-filter.component.html',
  styleUrls: ['./obra-social-filter.component.scss']
})
export class ObraSocialFilterComponent {

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  public descripcion = new UntypedFormControl('');
  constructor() { }
  
  ngOnInit(): void {
  }

  public search(): void {
    let body = {
      par_modo: "C",
      descripcion: this.descripcion.value
    };
    this.searchEvent.emit(body)
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    if(this.descripcion.value.length > 2 ) {
      this.searchEvent.emit(this.descripcion.value)
    }
  }

  public clearInputs(): void {
    this.descripcion.setValue("");
  }
}