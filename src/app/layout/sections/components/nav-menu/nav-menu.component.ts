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
        { // 01 - PROVINCIA
          title: 'Provincias',
          url: '/parametros/provincia',
          icon: 'keyboard_arrow_right',
        },
        { // 02 - TIPO DE DOCUMENTO
          title: 'Tipos de Documento',
          url: '/parametros/tipo-documento',
          icon: 'keyboard_arrow_right',
        },
        { // 03 - NACIONALIDAD
          title: 'Nacionalidades',
          url: '/parametros/nacionalidad',
          icon: 'keyboard_arrow_right',
        },
        { // 04 - DEPARTAMENTO
          title: 'Departamento',
          url: '/parametros/abm-departamento',
          icon: 'keyboard_arrow_right',
        },
        { // 08 - CONDICIONES DE IVA
          title: 'Condiciones de IVA',
          url: '/parametros/condicion-iva',
          icon: 'keyboard_arrow_right',
        },
        { // 09 - ESTADO CIVIL
          title: 'Estado Civil',
          url: '/parametros/estado-civil',
          icon: 'keyboard_arrow_right',
        },
        { // 12 - OBRA SOCIAL
          title: 'Obras Sociales',
          url: '/parametros/obra-social',
          icon: 'keyboard_arrow_right',
        },
        { // 13 - PREGUNTAS DDJJ
          title: 'Preguntas DDJJ',
          url: '/parametros/preguntas-ddjj',
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
