import { Posting } from './../_models/posting';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class PostingService {

  baseUrl = "https://localhost:5001/api";
  postings: Posting[];


  constructor(private http: HttpClient, private accountService: AccountService) { }

  getPostings(travelDate: string) {
    this.http.get(this.baseUrl + "/postings/getpostings/"+travelDate, { headers: this.accountService.getHeader() }).subscribe(response => {
      if (response) {
        this.postings = [];
        for (var i = 0; i < ((<any>response).length); i++) {
          this.postings.push(response[i]);
        }
      }
    })
    return this.postings;
  }

  createPosting(posting : Posting){
    this.http.post(this.baseUrl + "/postings/addposting", posting, { headers: this.accountService.getHeader() }).subscribe(response => {
      if (response) {
        console.log(response);
      }
    })
  }
}
