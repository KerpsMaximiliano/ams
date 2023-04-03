import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-obra-social-filter',
  templateUrl: './obra-social-filter.component.html',
  styleUrls: ['./obra-social-filter.component.scss']
})
export class ObraSocialFilterComponent {

  @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();

  public descripcion = new UntypedFormControl('');
  constructor() { }
  
  ngOnInit(): void {
  }

  public search(): void {
    this.searchEvent.emit(this.descripcion.value)
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    if(this.descripcion.value.length > 2 ) {
      this.searchEvent.emit(this.descripcion.value)
    }
  }

  public clearInputs(): void {
    this.descripcion.setValue("");
    this.search();
  }
}