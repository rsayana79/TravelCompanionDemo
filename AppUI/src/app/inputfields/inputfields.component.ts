import { ToastrService } from 'ngx-toastr';
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
  dateSelected = new Date();
  postingData : Posting = {
    postingID : 0,
    travelDate : null,
    originCountry : null,
    originAirport : null,
    destinationCountry : null,
    destinationAirport : null,
    userId : null,
    enableemailnotifications : true
  };
  
  


  constructor(private http: HttpClient, private countryService: CountryService, private airportService: AirportService, 
    private datePipe : DatePipe, private toastr : ToastrService) { }

  ngOnInit(): void {
    this.getCountries();
  }

  intializeCountries() {
    this.postingData.travelDate = this.datePipe.transform(this.dateSelected, "YYYY-MM-dd");               
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
    this.countryService.getCountries().subscribe(response => {
      if (response && this.countries === undefined) {
        this.countries = [];
        for (var i = 0; i < ((<any>response).length); i++) {      
          this.countries.push(response[i]);
        }
      }
    }, error => {this.toastr.error('Failed to fetch countries from server')},
    () => {this.intializeCountries();});
  }

  getAirports(country: string, source : string) {
    this.airportService.getAirports(country).subscribe(
      response => {
        if (response) {          
          this.airports = [];
          for (var i = 0; i < ((<any>response).length); i++) {
            this.airports.push(response[i]);
          }
        }
      },
      error => {this.toastr.error('Something went wrong. Please try again')},
      () => {this.loadAirports(country, source)});    
  }

  populateCoutries() {
    for (var i = 0; i < this.countries?.length; i++) {
      this.originCountry.push(this.countries[i].country1);
      this.destinationCountry.push(this.countries[i].country1);
    }
  }

  private _filterOriginCountry(originCountry: string): string[] {
    const filterValue = originCountry.toLowerCase();
    this.postingData.originCountry = null;
    return this.originCountry.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterOriginAirport(originAitport: string): string[] {
    const filterValue = originAitport.toLowerCase();
    this.postingData.originAirport = null;
    return this.originAirport.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterDestinationCountry(destinationCountry: string): string[] {
    const filterValue = destinationCountry.toLowerCase();
    this.postingData.destinationCountry = null;
    return this.destinationCountry.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterDestinationAirport(destinationAirport: string): string[] {
    const filterValue = destinationAirport.toLowerCase();
    this.postingData.destinationAirport = null;
    return this.destinationAirport.filter(option => option.toLowerCase().includes(filterValue));
  }

  loadAirports(country : string, source : string){
    if(source == 'originAirport'){
      this.postingData.originAirport = null;      
      this.populateOriginAirports(this.airports);      
      this.postingData.originCountry = country;
    }    
    else if(source == 'destinationAirport'){
      this.postingData.destinationAirport = null;      
      this.populateDestinationAirports(this.airports);      
      this.postingData.destinationCountry = country;
    }
  }

  setairport(airport : string, source : string){    
    if(source == 'origin'){
      this.postingData.originAirport = airport;
    }    
    else if(source == 'destination'){
      this.postingData.destinationAirport = airport;
    }
  }

  populateOriginAirports(airportList : Airport[]){
    this.originAirport=[];
    for (var i = 0; i < this.airports?.length; i++) {
      this.originAirport.push(this.airports[i].airport);
    }
    this.originAirportFilter = this.originAirportFormControl.valueChanges.pipe(
      startWith(''),
      map(origin => this._filterOriginAirport(origin)),
    );    
  }

  populateDestinationAirports(airportList : Airport[]){
    this.destinationAirport=[];
    for (var i = 0; i < this.airports?.length; i++) {
      this.destinationAirport.push(this.airports[i].airport);
    }
    this.destinationAirportFilter = this.destinationAirportFormControl.valueChanges.pipe(
      startWith(''),
      map(origin => this._filterDestinationAirport(origin)),
    );    
  }

}
