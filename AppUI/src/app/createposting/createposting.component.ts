import { AccountService } from './../_services/account.service';
import { Posting } from './../_models/posting';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputfieldsComponent } from '../inputfields/inputfields.component';
import { PostingService } from '../_services/posting.service';

@Component({
  selector: 'app-createposting',
  templateUrl: './createposting.component.html',
  styleUrls: ['./createposting.component.css']
})
export class CreatepostingComponent implements OnInit {

  enableEmailNotifications : boolean = true;

  constructor(private postingService : PostingService, private datePipe : DatePipe, private accountService : AccountService) { }

  ngOnInit(): void {
  }

  submitPosting(){
    var posting : Posting ={
      travelDate : this.datePipe.transform(InputfieldsComponent.postingData.travelDate, "YYYY-MM-dd")+"T00:00:00",
      originCountry : InputfieldsComponent.postingData.originCountry,
      originAirport : InputfieldsComponent.postingData.originAirport,
      destinationCountry : InputfieldsComponent.postingData.destinationCountry,
      destinationAirport : InputfieldsComponent.postingData.destinationAirport,
      enableemailnotifications : InputfieldsComponent.postingData.enableemailnotifications,
      userId : this.accountService.getcurrentUserId()
    };
    console.log(posting.travelDate);
    this.postingService.createPosting(posting);
  }
}
