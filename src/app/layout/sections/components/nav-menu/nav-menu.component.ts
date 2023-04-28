import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MenuChildren } from 'src/app/core/models/menuItem';
import { AuthService } from 'src/app/core/services/auth.service';
import { LayoutService } from 'src/app/core/services/layout.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent {
  @Output('hiddenToggled') hiddenToggled: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  public currentRoute: string = '';
  public sViewport: boolean = true;
  public opened: boolean = true;

  public sections: MenuItem[] = [
    {
      title: 'Parametros',
      expanded: true,
      children: [
        {
          title: 'PROVINCIAS',
          url: '/parametros/provincias',
          icon: 'keyboard_arrow_right',
        },
        {
          title: 'TIPOS DE DOCUMENTO',
          url: '/parametros/tipos-documento',
          icon: 'keyboard_arrow_right',
        },
        {
          title: 'NACIONALIDADES',
          url: '/parametros/nacionalidades',
          icon: 'keyboard_arrow_right',
        },
        {
          title: 'DEPARTAMENTOS',
          url: '/parametros/departamentos',
          icon: 'keyboard_arrow_right',
        },
        {
          title: 'CONDICIONES DE IVA',
          url: '/parametros/condiciones-iva',
          icon: 'keyboard_arrow_right',
        },
        {
          title: 'ESTADOS CIVILES',
          url: '/parametros/estados-civiles',
          icon: 'keyboard_arrow_right',
        },
        {
          title: 'OBRAS SOCIALES',
          url: '/parametros/obras-sociales',
          icon: 'keyboard_arrow_right',
        },
      ],
    },
  ];

  constructor(
    private router: Router,
    private service: LayoutService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      this.currentRoute = window.location.pathname;
    });
    this.sViewport = window.innerWidth <= 600;

    this.service.navHidden.subscribe((value) => (this.opened = !this.opened));
  }

  navigate(url: string, section: MenuItem) {
    this.router.navigateByUrl(url);
  }

  isActive(page: MenuChildren) {
    return this.router.url === page.url;
  }
}
