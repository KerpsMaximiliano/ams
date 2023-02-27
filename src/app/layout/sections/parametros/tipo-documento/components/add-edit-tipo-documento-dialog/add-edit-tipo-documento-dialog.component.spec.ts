import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditParametroDialogComponent } from './add-edit-tipo-documento-dialog.component';

describe('AddEditParametroDialogComponent', () => {
  let component: AddEditParametroDialogComponent;
  let fixture: ComponentFixture<AddEditParametroDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditParametroDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditParametroDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
