import { Posting } from './../_models/posting';
import { Airport } from './../_models/airport';
import { Component, OnInit, Output } from '@angular/core';
import { Country } from '../_models/country';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CountryService } from '../_services/country.service';
import { AirportService } from '../_services/airport.service';
import { map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inputfields',
  templateUrl: './inputfields.component.html',
  styleUrls: ['./inputfields.component.css']
})
export class InputfieldsComponent implements OnInit {

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
  originCountrySelected : string;
  originAirportSelected : string;
  destinationCountrySelected : string;
  destinationAirportSelected : string;
  dateSelected = new Date();
  static postingData : Posting = {
    travelDate : null,
    originCountry : null,
    originAirport : null,
    destinationCountry : null,
    destinationAirport : null,
    userId : null,
    enableemailnotifications : true
  };
  


  constructor(private http: HttpClient, private countryService: CountryService, private airportService: AirportService, private datePipe : DatePipe) { }

  ngOnInit(): void {
    if (this.countryService.countries === undefined) {
      this.getCountries();
    }
    //this.countries = this.getCountries();

    this.intialize();
  }

  async intialize() {
    InputfieldsComponent.postingData.travelDate = this.datePipe.transform(this.dateSelected, "YYYY-MM-dd");
    await this.delay(100)
    this.countries = this.countryService.countries;        
    this.populateCoutries();
    this.originCountryFilter = this.originCountryFormControl.valueChanges.pipe(
      startWith(''),
      map(origin => this._filterOriginCountry(origin)),
    );
    this.destinationCountryFilter = this.destinationCountryFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDestinationCountry(value)),
    );

  }

  getCountries() {
    this.countryService.getCountries();
  }

  getAirports(country: string) {
    this.airportService.getAirports(country);
  }

  populateCoutries() {
    /*     var countryArray = this.countries;
        console.log(`printing country array ${countryArray}`); */
    for (var i = 0; i < this.countries?.length; i++) {
      this.originCountry.push(this.countries[i].country1);
      this.destinationCountry.push(this.countries[i].country1);
    }
  }

  private _filterOriginCountry(originCountry: string): string[] {
    const filterValue = originCountry.toLowerCase();
    return this.originCountry.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterOriginAirport(originAitport: string): string[] {
    const filterValue = originAitport.toLowerCase();
    return this.originAirport.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterDestinationCountry(destinationCountry: string): string[] {
    const filterValue = destinationCountry.toLowerCase();
    return this.destinationCountry.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterDestinationAirport(destinationAirport: string): string[] {
    const filterValue = destinationAirport.toLowerCase();
    return this.destinationAirport.filter(option => option.toLowerCase().includes(filterValue));
  }


  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async loadAirports(country : string, source : string){    
    console.log(`country passed is ${country} source is ${source}`);
    this.getAirports(country); 
    await this.delay(100);   
    this.airports = this.airportService.airports; 
    //console.log(this.airports);
    if(source == 'originAirport'){
      this.populateOriginAirports(this.airports);
      this.originCountrySelected = country;
      InputfieldsComponent.postingData.originCountry = country;
    }    
    else if(source == 'destinationAirport'){
      this.populateDestinationAirports(this.airports);
      this.destinationCountrySelected = country;
      InputfieldsComponent.postingData.destinationCountry = country;
    }
  }

  setairport(airport : string, source : string){    
    if(source == 'origin'){
      this.originAirportSelected = airport;
      InputfieldsComponent.postingData.originAirport = airport;
    }    
    else if(source == 'destination'){
      this.destinationAirportSelected = airport;
      InputfieldsComponent.postingData.destinationAirport = airport;
    }
  }

  populateOriginAirports(airportList : Airport[]){
    for (var i = 0; i < this.airports?.length; i++) {
      this.originAirport.push(this.airports[i].airport);
    }
    this.originAirportFilter = this.originAirportFormControl.valueChanges.pipe(
      startWith(''),
      map(origin => this._filterOriginAirport(origin)),
    );    
  }

  populateDestinationAirports(airportList : Airport[]){
    for (var i = 0; i < this.airports?.length; i++) {
      this.destinationAirport.push(this.airports[i].airport);
    }
    this.destinationAirportFilter = this.destinationAirportFormControl.valueChanges.pipe(
      startWith(''),
      map(origin => this._filterDestinationAirport(origin)),
    );    
  }

}
