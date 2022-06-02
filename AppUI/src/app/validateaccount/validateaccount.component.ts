import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

@Component({
  selector: 'app-validateaccount',
  templateUrl: './validateaccount.component.html',
  styleUrls: ['./validateaccount.component.css']
})
export class ValidateaccountComponent implements OnInit {
  emailId: string;
  verificationCode: string;
  message: string = 'Account is being verified. Please wait.'
  verified : boolean = false;
  constructor(private route: ActivatedRoute, private accountService: AccountService) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.emailId = params.get('emailId');
      this.verificationCode = params.get('code');
      if (this.emailId && this.verificationCode) {
        this.accountService.validatePin(this.emailId, this.verificationCode).subscribe(response => {
          if (response) {
            console.log(`return response from API is ${response}`);
          }
        }, (error) => { this.message = "Account activation failed. Please contact travelcompanion.owner@gmail.com"},
          () => { 
            this.message = "Account verified. Please login using the form below.";
            this.verified = true;
         })        
      }
    });
  }

}
