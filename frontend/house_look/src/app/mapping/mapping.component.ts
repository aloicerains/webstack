import { query } from '@angular/animations';
import { getLocaleExtraDayPeriodRules } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent implements OnInit {

  latitude: number;
  longitude: number;
  private map: google.maps.Map;

  constructor(
    public http: HttpClient,
    public route: ActivatedRoute) {
   }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      if (queryParams.has('lat')) {
        this.latitude = Number(queryParams.get('lat'));
      }
      if (queryParams.has('lng')) {
        this.longitude = Number(queryParams.get('lng'));
      }
    })

    let loader = new Loader({
      apiKey: 'AIzaSyAFzlQVIg2QuAOg7pwOIgmGOX29TZgBXGM'
    });
    loader.load().then(() => {
      console.log('map loaded');

      const location = {
        lat: this.latitude,
        lng: this.longitude
      };

      console.log(location);
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 12
      })
      const marker = new google.maps.Marker({
        position: location,
        map: this.map
      })
    });


   }

}
