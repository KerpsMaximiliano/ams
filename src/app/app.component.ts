import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'ParametrosUI';
  public userLogged: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userLogged = this.authService.authenticated;
    this.authService.isAuthenticated().subscribe(auth => {
      this.userLogged = auth;
    })
  }

}
