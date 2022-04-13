import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Airport } from '../_models/airport';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class AirportService {
  baseUrl = "https://localhost:5001/api/airports";
  airports: Airport[];

  constructor(private http: HttpClient, private accountService: AccountService) { }

  getAirports(airportName : string) {
    this.http.get(this.baseUrl + "/getairports/"+airportName, { headers: this.accountService.getHeader() }).subscribe(
      response => {
        if (response) {          
          this.airports = [];
          for (var i = 0; i < ((<any>response).length); i++) {
            this.airports.push(response[i]);
          }
        }
      })
    return this.airports;
  }

  getAirport(countryName: string, airportName : string) {
    this.http.get(this.baseUrl + "/getairport/"+countryName+"/"+airportName, { headers: this.accountService.getHeader() }).subscribe(
      response => {
        if (response && this.airports === undefined) {
          console.log(`country service get countries async ${this.airports}`);
          this.airports = [];
          for (var i = 0; i < ((<any>response).length); i++) {
            this.airports.push(response[i]);
          }
        }
      })
    return this.airports;
  }

}
