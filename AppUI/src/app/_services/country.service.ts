import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../_models/country';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  baseUrl = "https://localhost:5001/api";


  constructor(private http: HttpClient, private accountService: AccountService) { }

  getCountries() : Observable<any> {
    return this.http.get(this.baseUrl + "/countries");  
  }

}
