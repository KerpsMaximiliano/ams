import { HeaderComponent } from './components/header/header.component';
import { SharedModule } from './../../shared/shared.module';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SectionsRoutingModule } from './sections-routing.module';
import { SectionsComponent } from './sections.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';


@NgModule({
  declarations: [
    SectionsComponent,
    NavMenuComponent,
    HeaderComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    SectionsRoutingModule,
    SharedModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class SectionsModule { }
