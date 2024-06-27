import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { LoginService } from './Principales/Servicios/login.service'; 
import { Subscription } from 'rxjs';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  
  title = 'Digma';
  miVariable: any;
  private subscription: Subscription | undefined;
  isSideNavCollapsed = false;
  screenWidth = 0;
  
  constructor(public authService: LoginService) {}

  Usuario(){
    this.subscription = this.authService.documentId$.subscribe(id => {
      this.miVariable = id;
    }); 
    return !!this.miVariable; 
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
}
