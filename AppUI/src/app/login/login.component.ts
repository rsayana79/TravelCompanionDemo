import { Observable } from 'rxjs';
import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any={  };
  registerMode = false;
  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
  }

  login(){
    console.log(this.model);
    this.accountService.login(this.model).subscribe(response =>{
      console.log(response);
      this.accountService.loggedIn = true;
    },
    error => { console.log(error)}
    )
  }

  toggleRegisterMode(){
    this.registerMode = !this.registerMode;
  }

  registerUser(){
    console.log(this.model);
    this.accountService.register(this.model).subscribe(response =>{
      console.log(response);
    },
    error=>{console.log(error)})
  }


}
