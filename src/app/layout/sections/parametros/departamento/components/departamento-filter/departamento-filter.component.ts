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
  @Input() public provincias: IProvincia[];

  @Output() public search: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('selectOptions') public selectOptions: any;

  constructor() {}

  public performSearch(value: string): void {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        letra_provincia: this.selectOptions?.value,
        descripcion: value,
      })
    );
  }

  public clear(inputElement: HTMLInputElement): void {
    this.selectOptions.value = '';
    inputElement.value = '';
  }
}
