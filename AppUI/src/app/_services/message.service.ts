import { ToastrService } from 'ngx-toastr';
import { BusyService } from './busy.service';
import { User } from './../_models/user';
import { AccountService } from './account.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../_models/message';
import { map, take } from 'rxjs/operators';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Group } from '../_models/groups';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[];
  users: User[];
  newMessageCounter: number[];
  baseUrl = "https://localhost:5001/api/messages/";
  hubUrl = "https://localhost:5001/hubs/";
  private hubConnection: HubConnection;
  currentUser: User;
  userIDInCurrentChat: number;
  userNameInCurrentChat: string;
  usersChatHub = new Map();
  usersmessageCounter = new Map<number, number>();
  constructor(private http: HttpClient, private accountService: AccountService, private busyService: BusyService, private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user);    
  }

  createHubConnection(user: User, recipientUserId: number) {
    if (this.usersChatHub.get(recipientUserId) == 0) {      
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(this.hubUrl + 'message?userid=' + this.currentUser.id + '&user=' + recipientUserId, {
          accessTokenFactory: () => user.token

        })
        .withAutomaticReconnect()
        .build()
      this.hubConnection.start().then(()=>this.usersChatHub.set(recipientUserId,1))
        .catch(error => this.toastr.error("Could not connect to server. Please come back later"))
        .finally(() => this.busyService.idle());
    }
    else {
      this.hubConnection.invoke('GetMessageThread', this.currentUser.id, recipientUserId).catch(error => {
        this.toastr.error("Failed to fetch messages. Please refresh the page")
      })

    }

    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messages = [];
      for (var i = 0; i < ((<any>messages).length); i++) {
        this.messages.push(messages[i]);
      }
      //resetting new messages to 0 as user clicked on chat
      var id = null;
      if (this.messages[0].senderId != this.currentUser.id) {
        id = this.messages[0].senderId;
      }
      else id = this.messages[0].recipientId;
      this.users.map((currentUser, index) => {
        if (currentUser.id == id) {
          this.accountService.newMessagesCount = this.accountService.newMessagesCount - this.users[index].newMessagesCount;
          this.users[index].newMessagesCount = 0;
        }
      });      
    })

    this.hubConnection.on('NewMessage', message => {   
      if(this.userIDInCurrentChat == message.senderId){
        this.messages.push(message);
      } 
      else{
        this.users.map((currentUser, index) => {
          if (currentUser.id == message.senderId) {
            this.users[index].newMessagesCount++; 
            this.accountService.newMessagesCount++;         
          }
        });
      }  
    })

    this.hubConnection.on('FromNewUser', user => {      
      this.users.push(user);
      this.accountService.newMessagesCount++;
      this.usersChatHub.set(user.id, 0);
    })
  }

  stopHubConnection() {
    if (this.hubConnection) {      
      this.hubConnection.stop();
      this.usersChatHub.clear();
    }
  }

  getUsersInChat() {
    this.http.get(this.baseUrl + 'getmessagesforuser/' + this.currentUser.id).subscribe(response => {
      if (response) {
        this.users = [];
        for (var i = 0; i < ((<any>response).length); i++) {          
          this.users.push(response[i]);
          this.usersChatHub.set(response[i].id, 0);          
        }
      }
    },
      error => { this.toastr.error('Failed to fetch messages');
    this.users = null; },
      () => {
        if (this.users?.length > 0) {
          this.getMessageThread(this.currentUser.id, this.users[0].id, this.users[0].userName);
        }
      })
  }


  getMessageThread(senderId: number, recipientId: number, recipientName: string) {
    this.userIDInCurrentChat = recipientId;
    this.userNameInCurrentChat = recipientName;
    if (this.usersChatHub.get(recipientId) === 0) {
      this.createHubConnection(this.currentUser, recipientId);
    }
    else {
      this.hubConnection.invoke('GetMessageThread', senderId, recipientId).catch(() => {
        this.toastr.error('We ran into an issue. Please relaod the page')        
      });
    }
  }

  async createMessage(message: Message) {
    return this.hubConnection.invoke('SendMessage', message).then(() => this.messages.push(message)).catch(error => console.log(error));

  }

  createMessagefromPostings(message: Message) {
    this.http.post(this.baseUrl + 'createMessage', message).subscribe(response => {
      if (response) {
        console.log(response);
      }
    })
  }
}
