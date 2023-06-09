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
  selector: 'app-departamento-filter',
  templateUrl: './departamento-filter.component.html',
  styleUrls: ['./departamento-filter.component.scss'],
})
export class DepartamentoFilterComponent {
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
    this.searchEvent.emit(JSON.stringify(body));
  }

  public clear(inputElement: HTMLInputElement) {
    this.selectOptions.value = '';
    inputElement.value = '';
  }
}
