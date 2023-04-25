import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditCondicionIvaDialogComponent } from './add-edit-condicion-iva-dialog.component';

describe('AddEditParametroDialogComponent', () => {
  let component: AddEditCondicionIvaDialogComponent;
  let fixture: ComponentFixture<AddEditCondicionIvaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCondicionIvaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCondicionIvaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
