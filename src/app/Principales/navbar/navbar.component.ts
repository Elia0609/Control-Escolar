import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { navAlumno } from '../../Modelos/nav-alumno';
import { navAdmin } from 'src/app/Modelos/nav-admin';
import { navProfesor } from 'src/app/Modelos/nav-profesor';
import { LoginService } from '../Servicios/login.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms',
          style({ opacity: 1 })
        )
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms',
          style({ opacity: 0 })
        )
      ])
    ]),
  ]
})

export class NavbarComponent implements OnInit {

  constructor(public authService: LoginService, private router: Router) {
    this.filterNavItems();
   }

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData : any;
  navAdmin = navAdmin;
  navAlumno = navAlumno;
  navProfe = navProfesor;
  private subscription: Subscription | undefined;
  role: string | null = null;
  idDoc: any;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768 ) {
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.filterNavItems();
  }

  filterNavItems(): void {
    this.subscription = this.authService.documentId$.subscribe(id => {
      if (id) {
        this.authService.getRol(id, "rol").then(rol => {
          this.role = rol;
          this.filterNavbarData();
        }).catch(error => {
          console.error("Error obteniendo el rol:", error);
        });
      }
    });
  }

    
  filterNavbarData(): void {
    if(this.role == 'Administrador'){
      this.navData = this.navAdmin;
    } else if(this.role == 'Profesor'){
      this.navData = this.navProfe;
    }else{
      this.navData = this.navAlumno;
    }
  }


  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  logout(): void {
    this.authService.logout();
  }

  onNavItemClick(data: any): void {
    if (data.label === 'Salir') {
      this.logout();
    }
  }

}