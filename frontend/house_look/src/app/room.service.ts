import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { Room } from './models/room.model';

const BACKEND_URL = environment.apiUrl + '/rooms/';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  addRoom(room: {
    houseId: string,
    roomName: string,
    roomType: string,
    isVacant: boolean,
    roomFloor: number,
    roomPrice: number
  }) {
    this.http.post<{message: string, status: boolean}>(BACKEND_URL,  room)
      .subscribe(responseData => {
        if (responseData.status) {
          this.router.navigate(['view', room.houseId]);
        }
      })
  }

  updateRoom(roomId: string, room: {
    houseId: string,
    roomName: string,
    roomType: string,
    isVacant: boolean,
    roomFloor: number,
    roomPrice: number
  }) {
    this.http.put<{message: string, status: boolean}>(BACKEND_URL + roomId, room)
      .subscribe(responseData => {
        if (responseData.status) {
          this.router.navigate(['view', room.houseId]);
        }
      })
  }

  bookRoom(roomId: string) {
    const update = {
      isVacant: false
    };
     return this.http.put
     <{message: string, status: boolean}>
     (BACKEND_URL + 'book/' + roomId, update);
  }

  getRooms(houseId: string) {

    const queryParams = `?houseId=${houseId}`;

    return this.http.get<{
      message: string,
      rooms: Room[],
      status: boolean
     }>(BACKEND_URL + queryParams);
  }

  getRoom(roomId: string) {
   return this.http.get<{
      room: Room, status: Boolean
    }>(BACKEND_URL + roomId);
  }

  deleteRoom(roomId: string) {
    return this.http.delete(BACKEND_URL + roomId);
  }

}
