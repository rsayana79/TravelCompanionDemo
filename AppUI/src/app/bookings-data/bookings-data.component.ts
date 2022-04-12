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

  baseUrl = "https://localhost:5001/api";
  countries: Country[];
  airports: Airport[];
  originCountryFormControl = new FormControl();
  destinationCountryFormControl = new FormControl();
  originAirportFormControl = new FormControl();
  destinationAirportFormControl = new FormControl();
  originCountry: string[] = [];
  destinationCountry: string[] = [];
  originAirport: string[] = [];
  destinationAirport: string[] = [];
  originCountryFilter: Observable<string[]>;
  destinationCountryFilter: Observable<string[]>;
  originAirportFilter: Observable<string[]>;
  destinationAirportFilter: Observable<string[]>;

  constructor(private http: HttpClient, private countryService: CountryService, private airportService: AirportService) { }



  ngOnInit(): void {
    if (this.countryService.countries === undefined) {
      this.countries = this.getCountries();
    }
    //this.countries = this.getCountries();

    this.intialize();
  }

  async intialize() {
    await this.delay(10)
    this.countries = this.countryService.countries;
    console.log(this.countries)
    this.populateCoutries();
    this.originCountryFilter = this.originCountryFormControl.valueChanges.pipe(
      startWith(''),
      map(origin => this._filterOrigin(origin)),
    );
    this.destinationCountryFilter = this.destinationCountryFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDestination(value)),
    );

  }

  getCountries() {
    return this.countryService.getCountries();
  }

  getAirports(country: string) {
    return this.airportService.getAirports(country);
  }

  populateCoutries() {
    /*     var countryArray = this.countries;
        console.log(`printing country array ${countryArray}`); */
    for (var i = 0; i < this.countries?.length; i++) {
      this.originCountry.push(this.countries[i].country1);
      this.destinationCountry.push(this.countries[i].country1);
    }
  }

  private _filterOrigin(origin: string): string[] {
    const filterValue = origin.toLowerCase();
    console.log(`filtering origin with filter value ${filterValue}`);
    return this.originCountry.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterDestination(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(`filtering destination with filter value ${filterValue}`);
    return this.destinationCountry.filter(option => option.toLowerCase().includes(filterValue));
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
