import { AirportService } from './../_services/airport.service';
import { Country } from './../_models/country';
import { HttpClient } from '@angular/common/http';
import { Component, DoCheck, OnInit } from '@angular/core';
import { CountryService } from '../_services/country.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Airport } from '../_models/airport';

@Component({
  selector: 'app-bookings-data',
  templateUrl: './bookings-data.component.html',
  styleUrls: ['./bookings-data.component.css']
})
export class BookingsDataComponent implements OnInit {


  constructor(private http: HttpClient, private countryService: CountryService, private airportService: AirportService) { }



  ngOnInit(): void {
  }


}
