import { User } from './../_models/user';
import { AccountService } from './account.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../_models/message';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[];
  users : User[]
  baseUrl = "https://localhost:5001/api/messages/";
  constructor(private http: HttpClient, private accountService: AccountService) { }

  getUsersInChat() {
    let currentUser = this.accountService.getcurrentUserId();
    this.http.get(this.baseUrl  + 'getmessagesforuser/' + currentUser, { headers: this.accountService.getHeader() }).subscribe(response => {
      if (response) {
        this.users = [];
        for (var i = 0; i < ((<any>response).length); i++) {          
          this.users.push(response[i]);
        }
      }
    })
    return this.users;
  }


  getMessageThread(id : number){
    let currentUser = this.accountService.getcurrentUserId();
    this.http.get(this.baseUrl  + 'messagethread/' + currentUser +'/' + id, { headers: this.accountService.getHeader() }).subscribe(response => {
      if (response) {
        this.messages = [];
        for (var i = 0; i < ((<any>response).length); i++) {          
          this.messages.push(response[i]);
        }
      }
    })
    return this.messages;
  }

  createMessage(message : Message){
    this.http.post(this.baseUrl  + 'createMessage', message, { headers: this.accountService.getHeader() }).subscribe(response => {
      if (response) {        
        console.log(response);
      }
    })
  }
}
