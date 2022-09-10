import { Injectable, OnInit } from '@angular/core';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';

import { House } from './models/house.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/houses/';

@Injectable({
  providedIn: 'root'
})
export class HouseService implements OnInit{
  private houses: House[] = [];
  private housesUpdated = new Subject<{ houses: House[], houseCount: number}>();
  private houseDataUpdated = new Subject<House>();
  userId: string;
  houseData: House;

  constructor(
    private http: HttpClient,
    private router: Router) { }

  ngOnInit(): void {

  }

  getHousesOfType(postsPerpage: number = 4, currentPage: number = 1, type: string = '', location: string = '') {
    let queryParams
    if (type && location) {
      queryParams = `?pageSize=${postsPerpage}&page=${currentPage}&type=${type}&location=${location}`;
    } else if (type && !location) {
      queryParams = `?pageSize=${postsPerpage}&page=${currentPage}&type=${type}`;
    } else if (location && !type) {
      queryParams = `?pageSize=${postsPerpage}&page=${currentPage}&location=${location}`;
    } else {
      queryParams = `?pageSize=${postsPerpage}&page=${currentPage}`;
    }

    this.http.get<{message: string, houses: any, maxHouses: number}>(BACKEND_URL + queryParams)
      .pipe(map(houseData => {
        return { houses: houseData.houses.map(house => {
          return {
            id: house._id,
            name: house.name,
            location: house.location,
            latitude: house.latitude,
            longitude: house.longitude,
            description: house.description,
            imagePath: house.imagePath,
            houseType: house.houseType,
            user: house.user
          };
        }),
        maxHouses: houseData.maxHouses,
      };
      }))
      .subscribe((updatedHouseData) => {
        this.houses = updatedHouseData.houses;
        this.housesUpdated.next({
          houses: [...this.houses],
          houseCount: updatedHouseData.maxHouses
        });
      });
  }

  getHouseUpdateListener() {
    return this.housesUpdated.asObservable();
  }

  getHouse(id: string) {
    return this.http.get<House>(BACKEND_URL + `${id}`);
  }

  getHouseInfo(id: string) {
    this.http.get<House>(BACKEND_URL + id).subscribe(house => {
      this.houseData = house;
      this.houseDataUpdated.next(this.houseData)
    });
  }

  getTypeUpdateListener() {
    return this.houseDataUpdated.asObservable();
  }

  addHouse(
    name: string,
    location: string,
    latitude: string,
    longitude: string,
    image: File,
    description: string,
    houseType: string[]
    ) {
    //const post: Post = {id: null, title: title, content: content};
    const postData = new FormData();
    postData.append("name", name);
    postData.append("location", location);
    postData.append('latitude', latitude);
    postData.append("longitude", longitude);
    postData.append("image", image, name);
    postData.append("description", description);
    postData.append("houseType", JSON.stringify(houseType));

    this.http.post<{message:string, house: House}>(BACKEND_URL, postData)
      .subscribe((responseData) => {
        this.router.navigate(["/"]);
      });
  }

  updateHouse(
    id: string, //house id
    name: string,
    location: string,
    latitude: string,
    longitude: string,
    image: File | string,
    description: string,
    houseType: string[]
    ) {
      let postData;
      //console.log(typeof(image));
      if (typeof(image) === 'object') {
        postData = new FormData();
        postData.append("name", name);
        postData.append("location", location);
        postData.append('latitude', latitude);
        postData.append("longitude", longitude);
        postData.append("image", image, name);
        postData.append("description", description);
        postData.append("houseType", JSON.stringify(houseType));
      } else {
        postData = {
          name, location, latitude, longitude,
          imagePath: image,
          description,
          houseType: JSON.stringify(houseType)
        };
      }
      this.http.put(BACKEND_URL + `${id}`, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deleteHouse(id: string) {
    return this.http.delete(BACKEND_URL + id);
  }
}
