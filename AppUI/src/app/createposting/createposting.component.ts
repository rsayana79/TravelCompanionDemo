import { AccountService } from './../_services/account.service';
import { Posting } from './../_models/posting';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { InputfieldsComponent } from '../inputfields/inputfields.component';
import { PostingService } from '../_services/posting.service';

@Component({
  selector: 'app-createposting',
  templateUrl: './createposting.component.html',
  styleUrls: ['./createposting.component.css']
})
export class CreatepostingComponent implements OnInit, AfterViewInit {
  @ViewChild(InputfieldsComponent) inputfield;
  enableEmailNotifications : boolean = true;
  postingData : Posting = {
    postingID : 0,
    travelDate : null,
    originCountry : null,
    originAirport : null,
    destinationCountry : null,
    destinationAirport : null,
    userId : null,
    enableemailnotifications : true
  };

  constructor(private postingService : PostingService, private datePipe : DatePipe, private accountService : AccountService) { }
  ngAfterViewInit(): void {
    this.postingData = this.inputfield.postingData;
  }

  ngOnInit(): void {
  }

  submitPosting(){
    this.postingData = this.inputfield.postingData;
    console.log(this.postingData.travelDate);
    this.postingData.userId = this.accountService.getcurrentUserId();
    this.postingData.enableemailnotifications = this.enableEmailNotifications;
    this.postingService.createPosting(this.postingData);
  }

  validData(): boolean{
    var valid = false;
    if(this.postingData.travelDate && this.postingData.originCountry && this.postingData.originAirport
      && this.postingData.destinationCountry && this.postingData.destinationAirport) valid = true;
    return valid;
  }
}
