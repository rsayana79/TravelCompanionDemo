import { BusyService } from './busy.service';
import { User } from './../_models/user';
import { AccountService } from './account.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../_models/message';
import { map, take } from 'rxjs/operators';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { Group } from '../_models/groups';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[];
  users: User[];
  newMessageCounter : number[];
  baseUrl = "https://localhost:5001/api/messages/";
  hubUrl = "https://localhost:5001/hubs/";
  private hubConnection: HubConnection;
  currentUser: User;
  userIDInCurrentChat: number;
  usersChatHub = new Map();
  usersmessageCounter = new Map<number, number>();
  constructor(private http: HttpClient, private accountService: AccountService, private busyService: BusyService) { }

  async createHubConnection(user: User, recipientUserId: number) {
    this.busyService.busy();
    if (!this.usersChatHub?.has(recipientUserId)) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user);
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(this.hubUrl + 'message?userid=' + this.currentUser.id + '&user=' + recipientUserId, {
          accessTokenFactory: () => user.token

        })
        .withAutomaticReconnect()
        .build()
      //this.usersChatHub.set(recipientUserId, this.hubConnection);
      console.log(this.usersChatHub)
      console.log(`starting hub connection`);
      this.hubConnection.start()
        .catch(error => console.log(error))
        .finally(() => this.busyService.idle());
    }
    else {
      console.log(`connection with user already exists`);
      //this.hubConnection = this.usersChatHub.get(recipientUserId);
      this.hubConnection.invoke('GetMessageThread', this.currentUser.id, recipientUserId).catch(error => {
        console.log(`error from reading message thread`)
        console.log(error)
      })

    }

    this.hubConnection.on('GetUsersWithMessages', users => {
      console.log(`total users returned is ${users.length}`);
      for(var i = 0; i <users.length; i++){
        this.usersChatHub.set(users[i].userName, users[i].newMessagesCount);
        //this.usersmessageCounter.set(users[i].userName, users[i].newMessagesCount);
        //this.users.push(user);
        console.log(`users returned from hub ${users[i].userName}`);
        //this.newMessageCounter.push(users[i].newMessagesCount);
      }      
    })

    this.hubConnection.on('MessageFromNewUser' , user => 
    {
      console.log(`new message from new user ${user.userName} and new message counr is ${user.newMessagesCount}`);
      if (!this.usersChatHub?.has(user.userName)){  
        for (let entry of this.usersChatHub.entries()) {
         console.log(`map data is ${entry[0]} and ${entry[1]}`)          
        } 
        this.usersChatHub.set(user.id, user.newMessagesCount);
        this.users.push(user);
      }
      else{
        console.log(`came into else`)
        this.users.map((currentUser, index) => {
           //equivalent to list[index]
           console.log(`came into map. current user is ${currentUser.id} name is ${currentUser.userName} and index is ${index}`)
           if(currentUser.id == user.id){
             this.users[index].newMessagesCount++;
             console.log(`incremented message count is ${this.users[index].newMessagesCount}`);
           }
        });
        //(this.usersmessageCounter.get(message.senderId))++;
        //increment message counter for message.senderName 
      }
    })

    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messages =[];
      for (var i = 0; i < ((<any>messages).length); i++) {
        this.messages.push(messages[i]);
      }
      console.log(`messages array retuned is ${messages}`);
      var messageThreadSource = new BehaviorSubject<Message[]>([]);    
      //this.usersChatHub.set(recipientUserId, messageThreadSource);
    })

    this.hubConnection.on('NewMessage', message => {
      console.log(`received new message from hub is ${message.content}`)
      if(this.userIDInCurrentChat == message.senderId){
        this.messages.push(message);
      }
      else{
        console.log(`came into else`)
        this.users.map((currentUser, index) => {
           //equivalent to list[index]
           console.log(`came into map. current user is ${currentUser.id} name is ${currentUser.userName} and index is ${index}`)
           if(currentUser.id == message.senderId){
             this.users[index].newMessagesCount++;
             console.log(`incremented message count is ${this.users[index].newMessagesCount}`);
           }
        });
      }
    })
  }

  stopHubConnection() {
    if (this.hubConnection) {
      console.log(`from stopping hub connection ${this.hubConnection}`);      
      this.hubConnection.stop();
      this.usersChatHub.clear();
    }
  }

  getUsersInChat() {
    let currentUser = this.accountService.getcurrentUserId();
    this.http.get(this.baseUrl + 'getmessagesforuser/' + currentUser, { headers: this.accountService.getHeader() }).subscribe(response => {
      if (response) {      
        this.users = [];
        for (var i = 0; i < ((<any>response).length); i++) {
          console.log(response[i]);
          this.users.push(response[i]);
          console.log(`returned user is ${response[i].userName}`)
        }
      }
    })
    return this.users;
  }


  async getMessageThread(senderId: number, recipientId: number, recipientName : string) {
    if (!this.usersChatHub.has(recipientName)) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user);
      await this.createHubConnection(this.currentUser, recipientId)
    }
    else {
      return this.hubConnection.invoke('GetMessageThread', senderId, recipientId).then(()=>{
        this.users.map((currentUser, index) => {
          //equivalent to list[index]
          console.log(`came into map. current user is ${currentUser.id} name is ${currentUser.userName} and index is ${index}`)
          if(currentUser.id == recipientId){
            this.users[index].newMessagesCount = 0;
            console.log(`New messages count reset to 0 ${this.users[index].newMessagesCount}`);
          }
       });
      }).catch(error => {
        console.log(`error from reading message thread`)
        console.log(error)
      });
    }    

  }

  async createMessage(message: Message) {    
    return this.hubConnection.invoke('SendMessage', message).then(()=>this.messages.push(message)).catch(error => console.log(error));

  }

  createMessagefromPostings(message: Message) {
    this.http.post(this.baseUrl + 'createMessage', message, { headers: this.accountService.getHeader() }).subscribe(response => {
      if (response) {
        console.log(response);
      }
    })
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
