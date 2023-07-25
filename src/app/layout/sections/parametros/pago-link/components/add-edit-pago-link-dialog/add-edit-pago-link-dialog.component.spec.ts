import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPagoLinkDialogComponent } from './add-edit-pago-link-dialog.component';

describe('AddEditPagoLinkDialogComponent', () => {
  let component: AddEditPagoLinkDialogComponent;
  let fixture: ComponentFixture<AddEditPagoLinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditPagoLinkDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPagoLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
