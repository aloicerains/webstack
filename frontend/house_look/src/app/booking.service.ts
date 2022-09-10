import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from "src/environments/environment";


const BACKEND_URL = environment.apiUrl + '/bookings/';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(
    private http: HttpClient,
    private router: Router
    ) { }

  createBooking(booking: {
    name: string,
    phoneNumber: number,
    houseId: string,
    room: string
  }) {
    //const userData: UserData = { em, password };
    this.http.post(BACKEND_URL, booking)
      .subscribe((response: {message: string, status: boolean}) => {
        if (response.status) {
          this.router.navigate(['view', booking.houseId]);
        }
      });

  }

  getBookingsByHouseId(houseId: string) {
    return this.http.get(BACKEND_URL + houseId);
  }

  deleteBooking(bookingId: string) {
    return this.http.delete(BACKEND_URL + bookingId);
  }
}
