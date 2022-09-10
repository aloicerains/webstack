import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

import { HouseService } from '../house.service';
import { House } from '../models/house.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  house: House[];
  private authListenerSub: Subscription;
  userIsAuthenticated = false;
  @Output() public sidenavToggle = new EventEmitter();
  constructor(
    public houseService: HouseService,
    public authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.userIsAuthenticated = authStatus;
      })
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
  }
}
