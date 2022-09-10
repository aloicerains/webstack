import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { HouseService } from '../house.service';
import { Room } from '../models/room.model';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit, OnDestroy {
  //userIsAuthenticated = false;
  //private authListenerSub: Subscription;
  houseTypeListener: Subscription;
  isLoading = false;
  houseId: string;
  roomId: string;
  form: FormGroup;
  imagePreview: string;
  roomTypes: string[] = [];
  mode = 'create';

  constructor(
    private authService: AuthService,
    public roomService: RoomService,
    public houseService: HouseService,
    public route: ActivatedRoute) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'name': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'type': new FormControl(null, {
        validators: [Validators.required]
      }),
      'vacancy': new FormControl(null, {
        validators: [Validators.required]
      }),
      'floor': new FormControl(null, {
        validators: [Validators.required]
      }),
      'price': new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('houseId')) {
        this.houseId = paramMap.get('houseId');
      }
      this.route.queryParamMap.subscribe(queryParam => {
        if (queryParam.has('roomId')) {
          this.mode = 'edit';
          this.roomId = queryParam.get('roomId');

          this.isLoading = true;

          this.roomService.getRoom(this.roomId).subscribe(
            (roomData: {room: Room, status: boolean}) => {

              this.isLoading = false;

              if (roomData.status) {
                this.form.setValue({
                  'name': roomData.room.roomName,
                  'type' : roomData.room.roomType,
                  'vacancy': roomData.room.isVacant,
                  'floor' : roomData.room.roomFloor,
                  'price' : roomData.room.roomPrice
                });
              }

            }
          )
        } else {
          this.mode = 'create';
          this.roomId = null;
        }
      })
    })

    this.isLoading = true;
    this.houseService.getHouseInfo(this.houseId);
    this.houseTypeListener = this.houseService.getTypeUpdateListener()
      .subscribe((houseData) => {
        this.isLoading = false;
        this.roomTypes = houseData.houseType
      });

  }

  onSaveRoom() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    const room = {
      houseId: this.houseId,
      roomName: this.form.value.name,
      roomType: this.form.value.type,
      isVacant: this.form.value.vacancy,
      roomFloor: this.form.value.floor,
      roomPrice: this.form.value.price
    };

    if (this.mode === 'create') {
      this.roomService.addRoom(room);
    } else {
      this.roomService.updateRoom(this.roomId, room);
    }
  }



  ngOnDestroy(): void {
    this.houseTypeListener.unsubscribe();
    //this.authListenerSub.unsubscribe();
  }

}
