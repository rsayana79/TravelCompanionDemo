import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any={  };
  registerMode = false;
  constructor(public accountService: AccountService, private router : Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  login(){
    console.log(this.model);
    this.accountService.login(this.model).subscribe(response =>{
      this.router.navigateByUrl('/viewbookings')
    },
    error => { 
      console.log(error);
      this.toastr.error(error.error);
      
    }
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
    error=>{
      console.log(error);
      this.toastr.error(error.error);
    })
  }


}
