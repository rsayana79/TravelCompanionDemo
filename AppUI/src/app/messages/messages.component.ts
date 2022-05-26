import { take } from 'rxjs/operators';
import { AccountService } from './../_services/account.service';
import { MessageService } from './../_services/message.service';
import { Message } from './../_models/message';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewChecked, HostListener } from '@angular/core';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy, AfterViewChecked {
  faPaperPlane = faPaperPlane;
  messages: Message[];
  users: User[];
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  newMessage: string;
  userIDInCurrentChat: number;
  userNameInCurrentChat: string;
  currentUser: User;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  intiailScrollPosition : number;
  userScrolled: boolean = false;


  constructor(public messageService: MessageService, private accountService: AccountService, private router: Router) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user);
  }
  ngAfterViewChecked(): void {
    if (!this.userScrolled) this.scrollToBottom();
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
    this.scrollToBottom();
  }



  async getusers() {
    this.messageService.getUsersInChat();
    await this.delay(100);
  }


  async getMessageThread(currentUserId: number, userId: number, userName: string) {
    await this.messageService.getMessageThread(currentUserId, userId, userName);
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


  loadMessageThread(user: User) {
    if (this.users.length > 0) {
      this.getMessageThread(this.currentUser.id, user.id, user.userName);
    }
    /*     await this.delay(100);
        this.messages = this.messageService.messages;
        await this.delay(10); */
    this.userIDInCurrentChat = user.id;
    this.messageService.userIDInCurrentChat = this.userIDInCurrentChat;
    this.userNameInCurrentChat = user.userName;
    this.newMessage = null;
    this.userScrolled = false;
  }

  createMessage() {
    var message: Message = {
      currentUserID: this.accountService.getcurrentUserId(),
      senderId: this.accountService.getcurrentUserId(),
      senderUserName: this.accountService.getcurrentUserName(),
      recipientId: this.userIDInCurrentChat,
      recipientUserName: this.userNameInCurrentChat,
      content: this.newMessage,
      dateRead: null,
      messageSent: new Date()
    };
    console.log(`message in chat window is ${this.newMessage} and chatting with ${this.userIDInCurrentChat}`);
    this.newMessage = ""
    this.messageService.createMessage(message);
    this.userScrolled = false;
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      this.intiailScrollPosition = this.myScrollContainer.nativeElement.scrollTop;
      console.log(`scroll top is ${this.myScrollContainer.nativeElement.scrollTop} and scroll height is ${this.myScrollContainer.nativeElement.scrollHeight}`);
    } catch (err) {
      console.log(err);
    }
  }

  createMessageEvent(event){
    this.createMessage();
    this.userScrolled = false;
  }
  userscrolled() {
    if(this.intiailScrollPosition > this.myScrollContainer.nativeElement.scrollTop){
      console.log(`user scrolled is true`);
      this.userScrolled = true;
    }
  }


}
