import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAbmLocalidadesDialogComponent } from './edit-abm-localidades-dialog.component';

describe('EditAbmLocalidadesDialogComponent', () => {
  let component: EditAbmLocalidadesDialogComponent;
  let fixture: ComponentFixture<EditAbmLocalidadesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAbmLocalidadesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAbmLocalidadesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
