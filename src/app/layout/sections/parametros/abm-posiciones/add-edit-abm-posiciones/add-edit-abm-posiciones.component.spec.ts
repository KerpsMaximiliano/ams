import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAbmPosicionesComponent } from './add-edit-abm-posiciones.component';

describe('AddEditAbmPosicionesComponent', () => {
  let component: AddEditAbmPosicionesComponent;
  let fixture: ComponentFixture<AddEditAbmPosicionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditAbmPosicionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAbmPosicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
