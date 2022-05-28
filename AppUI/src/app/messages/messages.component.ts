import { ToastrService } from 'ngx-toastr';
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
  newMessage: string = null;
  currentUser: User;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  intiailScrollPosition : number;
  userScrolled: boolean = false;


  constructor(public messageService: MessageService, private accountService: AccountService, private toastr : ToastrService) {
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
    this.accountService.newMessagesCount = 0;      
    this.scrollToBottom();
  }

  getusers() {
    this.messageService.getUsersInChat();
  }

  loadMessageThread(user: User) {
    this.messageService.getMessageThread(this.currentUser.id, user.id, user.userName);      
    this.newMessage = null;
    this.userScrolled = false;
  }

  createMessage() {
    var message: Message = {
      currentUserID: this.currentUser.id,
      senderId: this.currentUser.id,
      senderUserName: this.currentUser.userName,
      recipientId: this.messageService.userIDInCurrentChat,
      recipientUserName: this.messageService.userNameInCurrentChat,
      content: this.newMessage,
      dateRead: null,
      messageSent: new Date()
    };
    this.newMessage = null;
    this.messageService.createMessage(message);
    this.userScrolled = false;
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      this.intiailScrollPosition = this.myScrollContainer.nativeElement.scrollTop;      
    } catch (err) {
      console.log(err);
    }
  }

  userscrolled() {
    if(this.intiailScrollPosition > this.myScrollContainer.nativeElement.scrollTop){      
      this.userScrolled = true;
    }
  }


}
