import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../auth.service';
import { BookingService } from '../booking.service';
import { HouseService } from '../house.service';

import { House } from '../models/house.model'
import { resUserData } from '../models/user.model';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-room-booking',
  templateUrl: './room-booking.component.html',
  styleUrls: ['./room-booking.component.css']
})
export class RoomBookingComponent implements OnInit {

  userPhoneNumber: number;
  houseId: string;
  userId: string;
  roomId: string;
  isLoading = false;

  constructor(
    public route: ActivatedRoute,
    public houseService: HouseService,
    public bookingService: BookingService,
    private roomService: RoomService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('houseId')) {

        this.houseId = paramMap.get('houseId');
        this.isLoading = true;
// get userId
        this.houseService.getHouse(this.houseId)
          .subscribe((houseData: House) => {
            if (houseData) {
              this.userId = houseData.user;
// get user contact
            this.authService.getUser(this.userId)
              .subscribe((resData: {message: string, user: resUserData, status: boolean}) => {
                this.isLoading = false;
                if (resData.status) {
                  this.userPhoneNumber = resData.user.phoneNumber;
                }
              })
            } else {
              this.isLoading = false;
            }
          })
      }
// get roomId
      this.route.queryParamMap.subscribe((queryParam)=>{
        if (queryParam.has('roomId')) {
          this.roomId = queryParam.get('roomId');
        }
      })
    })
  }

  onBooking(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const booking = {
      houseId: this.houseId,
      room: this.roomId,
      name: form.value.name,
      phoneNumber: form.value.cellPhone
    };

   this.isLoading = true;
   this.roomService.bookRoom(this.roomId)
    .subscribe((result: {message: string, status: boolean}) => {
      this.isLoading = false;
      if (result.status) {
        this.bookingService.createBooking(booking);
      }
   })

  }

}
