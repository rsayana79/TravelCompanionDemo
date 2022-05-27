import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
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


  constructor(private http: HttpClient, private accountService: AccountService, private toastr: ToastrService) { }

  getPostings(travelDate: string): Observable<any> {
    return this.http.get(this.baseUrl + "/postings/getpostings/"+travelDate);
  }

  createPosting(posting : Posting){
    this.http.post(this.baseUrl + "/postings/addposting", posting).subscribe(response => {
      if (response) {
        console.log(response);
        this.toastr.success('Your posting is added. Please navigate to the Exisiting posts tab')
      }
    })
  }

  deletePosting(postingId : number){
    this.http.delete(this.baseUrl + "/postings/DeletePosting/"+postingId).subscribe(response => {
      if (response) {
        console.log(response);
        return response;      
      }
    },error => {this.toastr.error('Something went wrong. Posting not deleted')},
    ()=>{this.toastr.success('Posting deleted successfully')})    
  }


}
