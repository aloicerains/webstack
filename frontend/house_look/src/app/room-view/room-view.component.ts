import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { BookingService } from '../booking.service';
import { HouseService } from '../house.service';
import { ImageService } from '../image.service'
import { Booking } from '../models/booking.model';
import { Image } from '../models/image.model';
import { Room } from '../models/room.model';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-room-view',
  templateUrl: './room-view.component.html',
  styleUrls: ['./room-view.component.css']
})
export class RoomViewComponent implements OnInit, OnDestroy{
  private authListenerSub: Subscription;
  private houseListener: Subscription;
  userIsAuthenticated = false;
  houseId: string;
  userId: string;
  isLoading = false;

  images: Image[] = [];
  imgs: Image[] = [];
  rooms: Room[] = [];
  bookings: Booking[] = [];
  houseDescription: string;
  description: string;
  roomTypes: string[] = [];
  selectedIndex = 0;
  indicators = true;
  controls = true;
  autoSlide = true;
  slideInterval = 4000;

  displayedColumns: string[] = ['roomName', 'roomType', 'roomFloor', 'roomPrice', 'isVacant', 'action', 'delete'];
  displayedColumns2: string[] = ['name', 'phoneNumber', 'roomName', 'action'];
  dataSource: any;
  dataSource2: any;

  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    public houseService: HouseService,
    public imageService: ImageService,
    public roomService: RoomService,
    public bookingService: BookingService
    ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('houseId')) {
        this.houseId = paramMap.get('houseId');
      }
    })
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.isLoading = true;
    this.authListenerSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
        this.userIsAuthenticated = authStatus;
        this.userId = this.authService.getUserId();

        // obtain bookings for authenticated user only
       // if (this.userIsAuthenticated) {

       // }
      });

    this.isLoading = true;
    this.bookingService.getBookingsByHouseId(this.houseId)
        .subscribe((
          bookingData: {message: string, bookings: Booking[], status: boolean}
          ) => {
            this.isLoading = false;
            if (bookingData.status) {
              this.bookings = bookingData.bookings;
              this.dataSource2 = new MatTableDataSource(this.bookings);
            }
          });

    this.isLoading = true;
    this.imageService.getImages(this.houseId)
      .subscribe((imageData: any) => {
        this.isLoading = false;
        if (imageData.status) {
          this.images = imageData.images;
        }
    })
    this.isLoading = true;
    this.houseService.getHouseInfo(this.houseId);
        this.houseListener = this.houseService.getTypeUpdateListener().subscribe((house) => {
          this.isLoading = false;
          this.roomTypes = house.houseType;
          this.houseDescription = house.description;

          if (this.userId === house.user) {
            this.userIsAuthenticated = true;
          } else {
            this.userIsAuthenticated = false;
          }
        });

    this.isLoading = true;
    this.roomService.getRooms(
      this.houseId).subscribe(
        (roomData: {message: string, rooms: Room[], status: boolean}) => {
          this.isLoading = false;
          if (roomData.status) {
            this.rooms = roomData.rooms;
            this.dataSource = new MatTableDataSource(this.rooms);
          }
        })

    if (this.autoSlide && this.images) {
      this.autoSlideImages();
    }
  }

  autoSlideImages(): void {
    setInterval(() => {
      this.onNextClick();
    }, this.slideInterval);
  }

  // sets index of imge
  selectImage(index: number): void {
    this.selectedIndex = index;
    this.description = this.images[this.selectedIndex].imageDescription;
  }

  onPrevClick(): void {
    if (this.selectedIndex === 0) {
      this.selectedIndex = this.images.length;
    } else {
      this.selectedIndex--;
    }
  }

  onNextClick(): void {
    if (this.selectedIndex === this.images.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex++;
    }
    if (this.images.length > 0) {
      this.description = this.images[this.selectedIndex].imageDescription;
    }
  }

  filterRoom(imageType) {
    this.imgs = this.images;
    this.isLoading = true;
    this.imageService.getImages(this.houseId).subscribe((imageData: any) => {
      this.isLoading =false;
      if (imageData.status) {
        this.images= imageData.images.filter(image => image.roomType === imageType);
        this.selectImage(0);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  onDeleteImage() {
    this.isLoading = true; // start spinner
    const imageId = this.images[this.selectedIndex].id;
    this.images.splice(this.selectedIndex, 1);
    this.imageService.deleteImage(imageId)
      .subscribe({
        next: () => {
        this.imageService.getImages(this.houseId).subscribe((imageData: any) => {
          this.isLoading =false;
          if (imageData.status) {
            this.images = imageData.images;
          }
        }
        )
       },
      error: () => {
        this.isLoading = false;
       }
    });
  }

  onDeleteRoom(roomId: string) {
    this.isLoading = true;
    this.roomService.deleteRoom(roomId)
      .subscribe({
        next: () => {
          this.roomService.getRooms(
            this.houseId).subscribe(
              (roomData: {message: string, rooms: Room[], status: boolean}) => {
                this.isLoading = false;
                if (roomData.status) {
                  this.rooms = roomData.rooms;
                  this.dataSource = new MatTableDataSource(this.rooms);
                }
              });
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  onDeleteBooking(bookingId: string) {
    this.isLoading = true;
    this.bookingService.deleteBooking(bookingId)
      .subscribe({
        next: () => {
          this.bookingService.getBookingsByHouseId(this.houseId)
          .subscribe((bookingData: {message: string, bookings: Booking[], status: boolean}) => {
            this.isLoading = false;
            if (bookingData.status) {
              this.bookings = bookingData.bookings;
              this.dataSource2 = new MatTableDataSource(this.bookings);
            }
          })
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
    this.houseListener.unsubscribe();
  }

}
