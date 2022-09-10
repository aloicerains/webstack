import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "./about/about.component";
import { CreateHouseComponent } from "./create-house/create-house.component";
import { CreateRoomComponent } from "./create-room/create-room.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { LoginComponent } from "./login/login.component";
import { MappingComponent } from "./mapping/mapping.component";
import { RoomBookingComponent } from "./room-booking/room-booking.component";
import { RoomImagesComponent } from "./room-images/room-images.component";
import { RoomViewComponent } from "./room-view/room-view.component";
import { SignupComponent } from "./signup/signup.component";


const routes: Routes = [
  { path: '', component: HomePageComponent},
  { path: 'view/:houseId', component: RoomViewComponent },
  { path: 'book/:houseId', component: RoomBookingComponent },
  { path: 'create-house', component: CreateHouseComponent },
  { path: 'create-room/:houseId', component: CreateRoomComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'log-in', component: LoginComponent},
  { path: 'edit/:houseId', component: CreateHouseComponent },
  { path: 'room-images/:houseId', component: RoomImagesComponent},
  { path: 'mapping', component: MappingComponent},
  { path: 'about', component: AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
