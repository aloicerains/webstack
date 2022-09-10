import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { HouseService } from '../house.service';
import { ImageService } from '../image.service';
import { mimeType } from '../mime-type.validators';

@Component({
  selector: 'app-room-images',
  templateUrl: './room-images.component.html',
  styleUrls: ['./room-images.component.css']
})
export class RoomImagesComponent implements OnInit, OnDestroy {

  form: FormGroup;
  roomTypes: string[] = [];
  imagePreview: string;
  houseId: string;
  isLoading = false;
  mode = 'create';
  private houseListener: Subscription;

  constructor(
    public route: ActivatedRoute,
    public houseService: HouseService,
    public imageService: ImageService
    ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'roomType': new FormControl(null, {
        validators: [Validators.required]
      }),
      'description': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('houseId')) {
        this.houseId = paramMap.get('houseId');
        this.isLoading = true;
        this.houseService.getHouseInfo(this.houseId);
        this.houseListener = this.houseService.getTypeUpdateListener().subscribe((house) => {
          this.isLoading = false;
          this.roomTypes = house.houseType;
        })
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0]; // tells typescript that event will be of type HTMLInputElement
    this.form.patchValue({image: file});                      // which have file properties
    this.form.get('image').updateValueAndValidity();  // updates and validates file
    const reader = new FileReader();  //javascript reader
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveImage() {
    if (this.form.invalid) {
      return;
    }

    if (this.mode === 'create') {
      this.isLoading = true;
      this.imageService.addImage(
        this.houseId,
        this.form.value.roomType,
        this.form.value.description,
        this.form.value.image
      );
    }
    //this.form.reset();
  }


  ngOnDestroy(): void {
    this.houseListener.unsubscribe();
  }

}
