import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTipoProvinciaDialogComponent } from './edit-tipo-provincia-dialog.component';

describe('EditTipoProvinciaDialogComponent', () => {
  let component: EditTipoProvinciaDialogComponent;
  let fixture: ComponentFixture<EditTipoProvinciaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTipoProvinciaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTipoProvinciaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
