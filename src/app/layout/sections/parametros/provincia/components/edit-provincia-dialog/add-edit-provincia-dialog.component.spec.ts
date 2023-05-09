import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProvinciaDialogComponent } from './add-edit-provincia-dialog.component';

describe('AddEditProvinciaDialogComponent', () => {
  let component: AddEditProvinciaDialogComponent;
  let fixture: ComponentFixture<AddEditProvinciaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditProvinciaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditProvinciaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
