import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { HouseService } from '../house.service';
import { House } from '../models/house.model';


export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {
  filterTerm: string;
  houses: House[] = [];
  totalHouses = 0;
  housesPerPage = 4;
  currentPage = 1;
  pageSizeOptions = [1,3, 6, 12];
  private authListenerSub: Subscription;
  private housesSub: Subscription;
  userId: string;
  isLoading = false;
  userIsAuthenticated = false;

  constructor(
    private authService: AuthService,
    private houseService: HouseService,
    public route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((paramMap) => {
      if (paramMap.has('type')) {
        const type = paramMap.get('type');
        this.houseService.getHousesOfType(this.housesPerPage,this.currentPage, type);
      } else {
        this.houseService.getHousesOfType(this.housesPerPage, this.currentPage);
      }
      this.userId = this.authService.getUserId();
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.isLoading = true;

      this.housesSub = this.houseService.getHouseUpdateListener()
        .subscribe(housesData => {
          this.isLoading = false;
          this.houses = housesData.houses;
          this.totalHouses = housesData.houseCount;
        });

      this.authListenerSub = this.authService.getAuthStatusListener()
        .subscribe(authStatus => {
          this.userIsAuthenticated = authStatus;
          this.userId = this.authService.getUserId();
        })
    });
  }

  onChangedPage(pageData) {
    this.route.queryParamMap.subscribe((paramMap) => {
      if (paramMap.has('type')) {
        const type = paramMap.get('type');
        this.houseService.getHousesOfType(this.housesPerPage,this.currentPage, type);
      } else {
        this.houseService.getHousesOfType(this.housesPerPage, this.currentPage);
      }
      this.isLoading = true; // start spinner
      this.currentPage = pageData
    })
  }

  onDelete(houseId: string) {
    this.isLoading = true; // start spinner
    this.houseService.deleteHouse(houseId)
      .subscribe({
        next: () => {
        this.houseService.getHousesOfType(this.housesPerPage, this.currentPage);
       },
      error: () => {
        this.isLoading = false;
       }
    });
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
    this.housesSub.unsubscribe();
  }

}
