import { AccountService } from './../_services/account.service';
import { MessageService } from './../_services/message.service';
import { Message } from './../_models/message';
import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages : Message[];
  users : User[];
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  

  constructor(private messageService : MessageService, private accountService : AccountService) { }

  async ngOnInit(): Promise<void> {
    this.getusers();
    await this.delay(100);
    this.users = this.messageService.users;
    //console.log(`Messages for user are ${this.printUsers()}`)
    if(this.users?.length>0 )this.loadMessageThread(this.users[0]);
  }

  async getusers() {
    this.messageService.getUsersInChat();
    await this.delay(100);
  }


  async getMessageThread(id: number){
    this.messageService.getMessageThread(id);
    await this.delay(100);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  printMessage(){

    this.messages.forEach((message) =>{
      console.log(`Message sender ID is ${message.senderId}`);
      console.log(`Message sender Name is ${message.senderUserName}`);
      console.log(`Message is ${message.content}`);
      console.log(`Message recipient ID is ${message.recipientId}`);
      console.log(`Message recipinet name is ${message.recipientUserName}`);
    })
  }

  printUsers(){
    this.users.forEach((user)=>{
      console.log(`user is ${user.userName}`)
    })
  }

  async loadMessageThread(user: User){
    if(this.users.length > 0){
      this.getMessageThread(user.id);
    }
    await this.delay(100);
    this.messages = this.messageService.messages;
    await this.delay(10);
  }

}
