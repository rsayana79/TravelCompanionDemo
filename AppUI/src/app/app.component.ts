import { PresenceService } from './_services/presence.service';
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

  constructor(private http: HttpClient, private accountService : AccountService, private presenceService : PresenceService) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser(){
    const user : User = JSON.parse(localStorage.getItem('user'));
    if(user){
      this.accountService.setCurrentUser(user);
      this.presenceService.createHubConnection(user);
    }
    
  }


}
