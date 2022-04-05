import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  constructor(public accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
  }

  logout(){
    console.log("logout link clicked")
    this.router.navigateByUrl('/');
    this.accountService.logout();
  }
}
