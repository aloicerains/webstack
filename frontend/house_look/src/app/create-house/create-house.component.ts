import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../auth.service';

import { HouseService } from '../house.service';
import { mimeType } from '../mime-type.validators';
import { House } from '../models/house.model';

@Component({
  selector: 'app-create-house',
  templateUrl: './create-house.component.html',
  styleUrls: ['./create-house.component.css']
})
export class CreateHouseComponent implements OnInit {

  houseTypes = ['Single rooms', 'Bedsitters', '1-bedroom',
    '2-bedroom', '3-bedroom', '4-bedroom+'];

  form: FormGroup;
  imagePreview: string;
  isLoading = false;
  private mode = 'create';
  private houseId: string;

  constructor(
    public houseService: HouseService,
    public route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'name': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'location': new FormControl(null, {
        validators: [Validators.required]
      }),
      'latitude': new FormControl(null, {
        validators: [Validators.required]
      }),
      'longitude': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      'description': new FormControl(null, {
        validators: [Validators.required]
      }),
      'houseType': new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('houseId')) {
        this.mode = 'edit';
        this.houseId = paramMap.get('houseId');
        this.isLoading = true;
        this.houseService.getHouse(this.houseId).subscribe((house: House) => {
          this.isLoading = false;
          this.form.setValue({
            'name': house.name,
            'location': house.location,
            'latitude': house.latitude,
            'longitude': house.longitude,
            'image': house.imagePath,
            'description': house.description,
            'houseType': house.houseType
          });
        });
      } else {
        this.mode = 'create';
        this.houseId = null;
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

  getHouseId(): string {
    return this.houseId;
  }

  onSaveHouse() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.houseService.addHouse(
        this.form.value.name,
        this.form.value.location,
        this.form.value.latitude,
        this.form.value.longitude,
        this.form.value.image,
        this.form.value.description,
        this.form.value.houseType);
    } else {
      this.houseService.updateHouse(
        this.houseId,
        this.form.value.name,
        this.form.value.location,
        this.form.value.latitude,
        this.form.value.longitude,
        this.form.value.image,
        this.form.value.description,
        this.form.value.houseType
      );
    }
    //this.form.reset();
  }
}
