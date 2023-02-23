import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { LayoutService } from 'src/app/core/services/layout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public userLogged!: boolean;
  public username: string = '';
  public currentRoute: string = '';

  constructor(private layoutService: LayoutService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.username = 'Usuario Estados';
  }

  public toggleNav(){
    this.layoutService.navHidden.next(true)
  }

  public logout(){
    this.authService.logout();
  }

}
