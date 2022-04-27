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
  users: User[]
  baseUrl = "https://localhost:5001/api/messages/";
  hubUrl = "https://localhost:5001/hubs/";
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  private userThreadSource = new BehaviorSubject<User[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();
  userThread$ = this.userThreadSource.asObservable();
  currentUser: User;
  userIDInCurrentChat: number;
  usersChatHub = new Map();
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
      console.log(`users returned from hub ${users}`);
      this.userThreadSource.next(users);
    })

    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messages =[];
      for (var i = 0; i < ((<any>messages).length); i++) {
        this.messages.push(messages[i]);
      }
      console.log(`messages array retuned is ${messages}`);
      var messageThreadSource = new BehaviorSubject<Message[]>([]);
      this.messageThreadSource.next(messages);
      this.usersChatHub.set(recipientUserId, messageThreadSource);
    })

    this.hubConnection.on('NewMessage', message => {
      if(this.userIDInCurrentChat == message.senderId || this.userIDInCurrentChat == message.recipientId){
        this.messages.push(message);
      }
      console.log(`new message recevied is ${message.content}`)
      var newMessage$ = this.usersChatHub.get(message.recipientId).asObsevable();
      this.messageThread$.pipe(take(1)).subscribe(messages => {
        this.messageThreadSource.next([...messages, message])
      })
    })


    /* this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some(x => x.username === otherUsername)) {
        this.messageThread$.pipe(take(1)).subscribe(messages => {
          messages.forEach(message => {
            if (!message.dateRead) {
              message.dateRead = new Date(Date.now())
            }
          })
          this.messageThreadSource.next([...messages]);
        })
      }
    }) */
  }

  stopHubConnection() {
    if (this.hubConnection) {
      console.log(`from stopping hub connection ${this.hubConnection}`);
      //this.messageThreadSource.next([]);
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
          this.users.push(response[i]);
        }
      }
    })
    return this.users;
  }


  async getMessageThread(senderId: number, recipientId: number) {
    /*     let currentUser = this.accountService.getcurrentUserId();
        this.http.get(this.baseUrl + 'messagethread/' + currentUser + '/' + id, { headers: this.accountService.getHeader() }).subscribe(response => {
          if (response) {
            this.messages = [];
            for (var i = 0; i < ((<any>response).length); i++) {
              this.messages.push(response[i]);
            }
          }
        })
        return this.messages; */
    /*     if (!this.hubConnection) {
          this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user);
          this.createHubConnection(this.currentUser, recipientId)
          await this.delay(500);
        } */
    if (!this.usersChatHub.has(recipientId)) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user);
      await this.createHubConnection(this.currentUser, recipientId)
    }
    else {
      return this.hubConnection.invoke('GetMessageThread', senderId, recipientId).catch(error => {
        console.log(`error from reading message thread`)
        console.log(error)
      });
    }


  }

  async createMessage(message: Message) {
    if (!this.usersChatHub.has(message.recipientId)) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user);
      this.createHubConnection(this.currentUser, message.recipientId)
    }

    this.getUsersInChat();
    await this.delay(100);
    var exisitngUser = this.users?.find(user => user.userName == message.recipientUserName);
    if (!exisitngUser) {
      this.users.push({
        id: message.recipientId,
        userName: message.recipientUserName,
        token: null
      });
    }
    return this.hubConnection.invoke('SendMessage', message).catch(error => console.log(error));

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
