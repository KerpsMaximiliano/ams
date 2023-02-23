import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { LoginComponent } from './layout/login/login.component';

const routes: Routes = [
  {
    path: '',
    loadChildren:() => import ('./layout/sections/sections.module').then(m => m.SectionsModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'login', component: LoginComponent,
    canActivate:[NoAuthGuard]
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
