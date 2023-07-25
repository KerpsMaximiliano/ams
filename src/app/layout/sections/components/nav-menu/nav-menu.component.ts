import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

// * Services
import { AuthService } from 'src/app/core/services/auth.service';
import { LayoutService } from 'src/app/core/services/layout.service';

// * Interfaces
import {
  IMenuItem,
  IMenuChildren,
} from 'src/app/core/models/menuItem.interface';

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

  public sections: IMenuItem[] = [
    {
      title: 'Parametros',
      expanded: true,
      children: [
        {
          // 03 - NACIONALIDADES
          title: 'Nacionalidades',
          url: '/parametros/nacionalidades',
          icon: 'keyboard_arrow_right',
        },
        {
          // 01 - PROVINCIAS
          title: 'Provincias',
          url: '/parametros/provincias',
          icon: 'keyboard_arrow_right',
        },
        {
          // 04 - DEPARTAMENTOS
          title: 'Departamentos',
          url: '/parametros/departamentos',
          icon: 'keyboard_arrow_right',
        },
        {
          // 06 - LOCALIDADES
          title: 'Localidades',
          url: '/parametros/localidades',
          icon: 'keyboard_arrow_right',
        },
        {
          // 05 - POSICIONES
          title: 'Posiciones',
          url: '/parametros/posiciones',
          icon: 'keyboard_arrow_right',
        },
        {
          // 12 - OBRAS SOCIALES
          title: 'Obras sociales',
          url: '/parametros/obras-sociales',
          icon: 'keyboard_arrow_right',
        },
        {
          // 11 - FUENTES DE INGRESO
          title: 'Fuentes de ingreso',
          url: '/parametros/fuentes-ingreso',
          icon: 'keyboard_arrow_right',
        },
        {
          // 10 - MOTIVOS DE MOVIMIENTOS
          title: 'Motivos de movimientos',
          url: '/parametros/motivos-movimientos',
          icon: 'keyboard_arrow_right',
        },
        {
          // 13 - PREGUNTAS DE DECLARACIONES JURADAS
          title: 'Preguntas de DDJJ',
          url: '/parametros/preguntas-ddjj',
          icon: 'keyboard_arrow_right',
        },
        {
          // 08 - CONDICIONES DE IVA
          title: 'Condiciones de IVA',
          url: '/parametros/condiciones-iva',
          icon: 'keyboard_arrow_right',
        },
        {
          // 07 - FORMAS DE PAGO
          title: 'Formas de pago',
          url: '/parametros/formas-pago',
          icon: 'keyboard_arrow_right',
        },
        {
          // 02 - TIPOS DE DOCUMENTO
          title: 'Tipos de documento',
          url: '/parametros/tipos-documento',
          icon: 'keyboard_arrow_right',
        },
        {
          // 09 - ESTADOS CIVILES
          title: 'Estados civiles',
          url: '/parametros/estados-civiles',
          icon: 'keyboard_arrow_right',
        },
        {
          // 20 - PRODUCTOS
          title: 'Productos',
          url: '/parametros/productos',
          icon: 'keyboard_arrow_right',
        },
        {
          // 30 - REGLAS PARA MOVIMIENTOS PARA NOVEDADES AUTOMATICAS
          title: 'Reglas para movimientos',
          url: '/parametros/mvmts-novedades-automaticas',
          icon: 'keyboard_arrow_right',
        },
        {
          // 31 - TAMBOS
          title: 'Tambos',
          url: '/parametros/tambos',
          icon: 'keyboard_arrow_right',
        },
        {
          // 34 - EMPRESA FACTURA
          title: 'Empresa que Factura',
          url: '/parametros/empresa-factura',
          icon: 'keyboard_arrow_right',
        },
        {
          // 35 - MONTOS MINIMOS
          title: 'Montos Minimos',
          url: '/parametros/monto-minimo',
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

  navigate(url: string, section: IMenuItem) {
    this.router.navigateByUrl(url);
  }

  isActive(page: IMenuChildren) {
    return this.router.url === page.url;
  }
}
