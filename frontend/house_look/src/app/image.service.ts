import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Image } from './models/image.model';


const BACKEND_URL = environment.apiUrl + '/images/';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  addImage(
    houseId: string,
    roomType: string,
    imageDescription: string,
    image: File
  ) {
    const postData = new FormData();
    postData.append('houseId', houseId);
    postData.append('roomType', roomType);
    postData.append('imageDescription', imageDescription);
    postData.append('image', image, imageDescription);

    this.http.post<{message: string, status: boolean}>(BACKEND_URL, postData)
      .subscribe(response => {
        if (response.status) {
          this.router.navigate(['view', houseId]);
        }
      });
  }

  getImages(houseId: string) {
    const queryParams = `?houseId=${houseId}`;
    return this.http.get
    <{message: string, images: Image, status: boolean}>
    (BACKEND_URL + queryParams);
  }

  deleteImage(imageId: string) {
    return this.http.delete(BACKEND_URL + imageId);
  }
}
