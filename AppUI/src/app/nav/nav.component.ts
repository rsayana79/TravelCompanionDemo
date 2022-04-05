import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
  }

  logout(){
    console.log("logout link clicked")
    this.accountService.logout();
  }
}
