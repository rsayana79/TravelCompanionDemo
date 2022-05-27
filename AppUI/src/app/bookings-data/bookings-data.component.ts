import { take } from 'rxjs/operators';
import { User } from './../_models/user';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MessageService } from './../_services/message.service';
import { AccountService } from './../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { PostingService } from './../_services/posting.service';
import { AirportService } from './../_services/airport.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CountryService } from '../_services/country.service';
import { Posting } from '../_models/posting';
import { DatePipe } from '@angular/common';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Message } from '../_models/message';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-bookings-data',
  templateUrl: './bookings-data.component.html',
  styleUrls: ['./bookings-data.component.css']
})
export class BookingsDataComponent implements OnInit {
  faTrashCan = faTrashCan;
  faMessage = faMessage;
  faCircleXmark = faCircleXmark;
  faPaperPlane = faPaperPlane;
  postings: Posting[];
  defaultDate = new Date();
  displayedColumns: string[] = ['travelDate', 'originCountry', 'originAirport', 'destinationCountry', 'destinationAirport', 'contactSender'];
  dataSource: MatTableDataSource<Posting>;
  newMessage: string;
  messagePostedById: number;
  messagePostedByUserName: string;
  dateSelected = new Date();
  showMessageWindow = false;
  currentUser : User;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table : MatTable<Posting>;


  constructor(private countryService: CountryService, private airportService: AirportService,
    private postingService: PostingService, private datePipe: DatePipe,
    private liveAnnouncer: LiveAnnouncer, private toastr: ToastrService,
    private accountService: AccountService, private messageService: MessageService) { }



  ngOnInit(): void {
    this.getpostings(this.datePipe.transform(this.defaultDate, 'yyyy-MM-dd'))
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user);
  }

  getpostings(travelDate: string) {
    this.postingService.getPostings(travelDate).subscribe(response => {
      if (response) {
        this.postings = [];
        for (var i = 0; i < ((<any>response).length); i++) {
          this.postings.push(response[i]);
        }
      }
    },
    error => {console.log(error)},
    () => {this.initializadateSouce()});    
  }

  initializadateSouce() {
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

  intializeSender(userId: number, userName: string) {
    this.messagePostedById = userId;
    this.messagePostedByUserName = userName;
    this.showMessageWindow = true;
  }

  closeMessageWindow() {
    this.showMessageWindow = false;
  }

  contactSender() {
    console.log(`message is ${this.newMessage}`);
    var message: Message = {
      currentUserID : this.accountService.getcurrentUserId(),
      senderId: this.accountService.getcurrentUserId(),
      senderUserName: this.accountService.getcurrentUserName(),
      recipientId: this.messagePostedById,
      recipientUserName: this.messagePostedByUserName,
      content: this.newMessage,
      dateRead: null,
      messageSent: new Date()
    };
    this.messageService.createMessagefromPostings(message);
    this.toastr.success("Your message is on it's way. Look in the messages tab for a response");
    this.showMessageWindow = false;
    this.newMessage = null;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPostingsForSelectedDate(event: MatDatepickerInputEvent<Date>){    
    this.getpostings(this.datePipe.transform(event.value, 'yyyy-MM-dd'))    
  }

  deletePosting(postingID : number){
    console.log(`deleted posting is ${postingID}`);
    this.postingService.deletePosting(postingID);
    var index = this.getPostingID(postingID);
    console.log(`index to remove is ${index}`);
    if(index != -1) {
      this.postings.splice(index,1);
      this.initializadateSouce();
      this.table.renderRows();         
    }    
  }

  getPostingID(postingId : number): number{
    var position = -1;
    try{
      this.postings.forEach(function (post, index) {
        if(postingId === post.postingID) {
          position = index;
          throw new Error("Match found");
        };
      })
    }catch(error){}
    return position;
  }
}
