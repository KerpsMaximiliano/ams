import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditObraSocialDialogComponent } from './add-edit-obra-social-dialog.component';


describe('AddEditParametroDialogComponent', () => {
  let component: AddEditObraSocialDialogComponent;
  let fixture: ComponentFixture<AddEditObraSocialDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditObraSocialDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditObraSocialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
