import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  registerMode = false;
  registerForm: FormGroup;
  loginForm: FormGroup;
  validationPopUp = false;   
  loginValidationErrors: string[] = [];
  registerValidationErrors: string[] = [];
  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService,
    private formBuilder: FormBuilder, private registerFormBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initializeLogin();
  }

  login() {
    console.log(this.loginForm.value);
    this.accountService.login(this.loginForm.value).subscribe(response => {
      this.router.navigateByUrl('/viewbookings')
    }, error => {
      console.log(`from login error handling`);
      this.loginValidationErrors = error;
    })
  }


  initializeLogin() {
    this.loginForm = this.formBuilder.group({
      loginId: ['', Validators.required],
      password: ['', [Validators.required,
      Validators.minLength(8)]]
    })
  }

  initializeRegister() {
    this.registerForm = this.formBuilder.group({
      userName: ['', Validators.required],
      emailId: ['', Validators.required],
      password: ['', [Validators.required,
      Validators.minLength(8)]]
    })
  }

  toggleRegisterMode() {
    this.registerMode = !this.registerMode;
    if (this.registerMode) {
      this.initializeRegister();
    }
  }

  registerUser() {
    console.log(this.registerForm.value);
    this.accountService.register(this.registerForm.value).subscribe(response => {
      console.log(response);
    },
      error => {
        this.registerValidationErrors = error;
        this.toastr.error("Registration failed. Please try again")
      },
      ()=>{
        this.router.navigateByUrl('');
        this.registerMode = false;
        this.validationPopUp = true;
      })
  }


}
