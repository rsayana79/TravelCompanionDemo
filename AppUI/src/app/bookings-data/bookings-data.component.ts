import { Country } from './../_models/country';
import { HttpClient } from '@angular/common/http';
import { Component, DoCheck, OnInit } from '@angular/core';
import { CountryService } from '../_services/country.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocomplete} from '@angular/material/autocomplete';

@Component({
  selector: 'app-bookings-data',
  templateUrl: './bookings-data.component.html',
  styleUrls: ['./bookings-data.component.css']
})
export class BookingsDataComponent implements OnInit {

  baseUrl = "https://localhost:5001/api";
  countries: Country[];
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  constructor(private http: HttpClient, private countryService: CountryService) { }
 

  ngOnInit(): void {
    if (this.countryService.countries !== undefined) {
      this.countries = this.countryService.countries;  
      this.populateCoutries();                
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value)),
      );
    }
    else {
      //this.countries = this.getCountries();
      this.getCountries();      
    }
  }

  getCountries() {
    return this.countryService.loadCountries();
  }

  populateCoutries() {
/*     var countryArray = this.countries;
    console.log(`printing country array ${countryArray}`); */
    for(var i = 0;i <this.countries?.length; i++ ){
      this.options.push(this.countries[i].country1);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();    
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}
