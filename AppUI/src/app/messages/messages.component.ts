import { take } from 'rxjs/operators';
import { AccountService } from './../_services/account.service';
import { MessageService } from './../_services/message.service';
import { Message } from './../_models/message';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {

  messages: Message[];
  users: User[];
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  newMessage: string;
  userIDInCurrentChat: number;
  userNameInCurrentChat: string;
  currentUser : User;

  constructor(public messageService: MessageService, private accountService: AccountService, private router: Router) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user);
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  async ngOnInit(): Promise<void> {
    this.getusers();
    await this.delay(100);
    this.users = this.messageService.users;
    //console.log(`Messages for user are ${this.printUsers()}`)
    if (this.users?.length > 0) this.loadMessageThread(this.users[0]);
  }

  async getusers() {
    this.messageService.getUsersInChat();
    await this.delay(100);
  }


  async getMessageThread(currentUserId : number, userId: number) {
    this.messageService.createHubConnection(this.currentUser, userId)
/*     await this.delay(100);
    this.messageService.getMessageThread(currentUserId, userId);
    await this.delay(100); */
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  printMessage() {

    this.messages.forEach((message) => {
      console.log(`Message sender ID is ${message.senderId}`);
      console.log(`Message sender Name is ${message.senderUserName}`);
      console.log(`Message is ${message.content}`);
      console.log(`Message recipient ID is ${message.recipientId}`);
      console.log(`Message recipinet name is ${message.recipientUserName}`);
    })
  }


  async loadMessageThread(user: User) {
    if (this.users.length > 0) {
      this.getMessageThread(this.currentUser.id, user.id);
    }
/*     await this.delay(100);
    this.messages = this.messageService.messages;
    await this.delay(10); */
    this.userIDInCurrentChat = user.id;
    this.messageService.userIDInCurrentChat = this.userIDInCurrentChat;
    this.userNameInCurrentChat = user.userName;
    this.newMessage = null;
  }

  async createMessage() {
    var message: Message = {
      currentUserID : this.accountService.getcurrentUserId(),
      senderId: this.accountService.getcurrentUserId(),
      senderUserName: this.accountService.getcurrentUserName(),
      recipientId: this.userIDInCurrentChat,
      recipientUserName: this.userNameInCurrentChat,
      content: this.newMessage,
      dateRead: null,
      messageSent: new Date()
    };
    console.log(`message in chat window is ${this.newMessage} and chatting with ${this.userIDInCurrentChat}`);
    this.newMessage ="";
    await this.delay(100);
    this.messageService.createMessage(message);
  }

}
