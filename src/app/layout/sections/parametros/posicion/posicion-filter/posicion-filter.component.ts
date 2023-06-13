import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

// * Interfaces
import { IProvincia } from 'src/app/core/models/provincia.interface';

@Component({
  selector: 'app-posicion-filter',
  templateUrl: './posicion-filter.component.html',
  styleUrls: ['./posicion-filter.component.scss'],
})
export class PosicionFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() provincias: IProvincia[];
  @ViewChild('selectOptions') selectOptions: any;

  constructor() {}

  ngOnInit(): void {}

  public search(event: any, value: string): void {
    event.preventDefault();
    let selectValue = this.selectOptions?.value;
    let body = {
      par_modo: 'O',
      letra_provincia: selectValue,
      descripcion: value,
    };
    this.searchEvent.emit(body);
  }

  public clear(inputElement: HTMLInputElement) {
    this.selectOptions.value = '';
    inputElement.value = '';
  }
}
