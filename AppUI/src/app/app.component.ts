import { AccountService } from './_services/account.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AppUI';
  countries: any;

  constructor(private http: HttpClient, private accountService : AccountService) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser(){
    const user : User = JSON.parse(localStorage.getItem('user'));
    this.accountService.setCurrentUser(user);
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
