import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AppUI';
  countries: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getCountries();
  }

  getCountries(){
    this.http.get("https://localhost:5001/api/countries").subscribe(
      response => {
        this.countries = response;
      },
      error => {
        console.log(error);
        
      }
    )
  }

}
