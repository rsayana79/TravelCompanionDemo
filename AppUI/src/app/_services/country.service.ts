import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Country } from '../_models/country';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  baseUrl = "https://localhost:5001/api";
  countries: Country[];


  constructor(private http: HttpClient, private accountService: AccountService) { }

  getCountries() {
    this.http.get(this.baseUrl + "/countries", { headers: this.accountService.getHeader() }).subscribe(response => {
      if (response && this.countries === undefined) {
        this.countries = [];
        for (var i = 0; i < ((<any>response).length); i++) {
          this.countries.push(response[i]);
        }
      }
    })
    return this.countries;
  }

}
