import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEstadoDialogComponent } from './add-edit-estado-dialog.component';

describe('AddEditEstadoDialogComponent', () => {
  let component: AddEditEstadoDialogComponent;
  let fixture: ComponentFixture<AddEditEstadoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditEstadoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditEstadoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
