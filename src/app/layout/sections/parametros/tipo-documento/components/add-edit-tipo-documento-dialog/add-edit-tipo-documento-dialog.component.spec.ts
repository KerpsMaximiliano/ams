import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditTipoDocumentoDialogComponent } from './add-edit-tipo-documento-dialog.component';


describe('AddEditParametroDialogComponent', () => {
  let component: AddEditTipoDocumentoDialogComponent;
  let fixture: ComponentFixture<AddEditTipoDocumentoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditTipoDocumentoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTipoDocumentoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
