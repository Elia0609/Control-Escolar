import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { LoginService } from '../Servicios/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit, OnDestroy {

  miVariable: any;
  private subscription: Subscription | undefined;
  @Input() collapsed = false;
  @Input() screenWidth = 0;
  constructor(public authService: LoginService) {}

  ngOnInit(): void {
    this.subscription = this.authService.documentId$.subscribe(id => {
      this.miVariable = id;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getBodyClass(): string {
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else if(this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
      styleClass = 'body-md-screen'
    }
    return styleClass;
  }

}
