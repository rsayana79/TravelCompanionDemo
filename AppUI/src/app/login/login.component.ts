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
  model: any = {};
  registerMode = false;
  validationPopUp = false;
  validationCode: string;
  showWrongCode = false;
  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  login() {
    console.log(this.model);
    this.accountService.login(this.model).subscribe(response => {
      this.router.navigateByUrl('/viewbookings')
    },
      error => {
        console.log(error);
        this.toastr.error(error.error);

      }
    )
  }

  toggleRegisterMode() {
    this.registerMode = !this.registerMode;
  }

  registerUser() {
    console.log(this.model);
    this.accountService.register(this.model).subscribe(response => {
      console.log(response);
      this.router.navigateByUrl('')
      this.validationPopUp = true;
      this.registerMode = true;
      console.log(`Opened pop up`);
    },
      error => {
        console.log(error);
        this.toastr.error(error.error);
      })
  }

  async validatePin() {
    console.log(`entered validation code is ${this.validationCode}`);
    var uservalidated = this.accountService.validatePin(this.validationCode);
    await this.delay(1000);
    console.log(`user validation result is ${uservalidated}`)
    if (uservalidated) {
      this.validationPopUp = false;
      this.toastr.success("User registered successfully. Please login");
      this.accountService.logout();
      this.registerMode = false;
      this.router.navigateByUrl('');      
    }
    else{
      this.showWrongCode = true;
    }    
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
