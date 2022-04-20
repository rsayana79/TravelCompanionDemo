import { MessageService } from './../_services/message.service';
import { AccountService } from './../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { PostingService } from './../_services/posting.service';
import { AirportService } from './../_services/airport.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CountryService } from '../_services/country.service';
import { Posting } from '../_models/posting';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator} from '@angular/material/paginator';
import { Message } from '../_models/message';


@Component({
  selector: 'app-bookings-data',
  templateUrl: './bookings-data.component.html',
  styleUrls: ['./bookings-data.component.css']
})
export class BookingsDataComponent implements OnInit {

  postings: Posting[];
  defaultDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  displayedColumns: string[] = ['travelDate', 'originCountry', 'originAirport', 'destinationCountry', 'destinationAirport', 'contactSender'];
  dataSource: MatTableDataSource<Posting>;
  newMessage: string;
  messagePostedById : number;
  messagePostedByUserName : string;
  showMessageWindow = false;


  constructor(private countryService: CountryService, private airportService: AirportService,
    private postingService: PostingService, private datePipe: DatePipe,
    private liveAnnouncer: LiveAnnouncer, private toastr: ToastrService, 
    private accountService : AccountService, private messageService : MessageService) { }


  ngOnInit(): void {
    this.getpostings(this.defaultDate)
    this.intialize();
  }

  async intialize() {
    await this.delay(10);
    this.postings = this.postingService.postings;
    console.log(`from on init`);
    this.initializadateSouce();
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  
  getpostings(travelDate: string) {
    this.postingService.getPostings(travelDate);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

 //@ViewChild(MatSort) sort: MatSort;

  initializadateSouce(){
    this.dataSource = new MatTableDataSource(this.postings);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  
  }



  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  intializeSender(userId : number, userName : string){
    console.log(`User who posted this posting is ${userId} and user name is ${userName}`);
    this.messagePostedById = userId;
    this.messagePostedByUserName = userName;
    console.log(`Sender ID is ${this.messagePostedById} and sender name is ${this.messagePostedByUserName}`);
    this.showMessageWindow = true;
  }

  closeMessageWindow(){
    this.showMessageWindow = false;
  }

  contactSender(){
    console.log(`message is ${this.newMessage}`);
    var message: Message = {
      senderId: this.accountService.getcurrentUserId(),
      senderUserName: this.accountService.getcurrentUserName(),
      recipientId: this.messagePostedById,
      recipientUserName: this.messagePostedByUserName,
      content: this.newMessage,
      dateRead: null,
      messageSent: new Date()
    };
    this.messageService.createMessage(message);
    this.toastr.success("Your message is on it's way. Look in the messages tab for a response");

    this.showMessageWindow = false;
    this.newMessage = null;
  }


}
