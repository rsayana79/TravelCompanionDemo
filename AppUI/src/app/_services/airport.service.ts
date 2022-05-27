import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Airport } from '../_models/airport';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class AirportService {
  baseUrl = "https://localhost:5001/api/airports";

  constructor(private http: HttpClient, private accountService: AccountService) { }

  getAirports(airportName : string) : Observable<any> {
    return this.http.get(this.baseUrl + "/getairports/"+airportName)
  }
}
