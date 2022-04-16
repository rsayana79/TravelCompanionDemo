import { Component, OnInit } from '@angular/core';
import { InputfieldsComponent } from '../inputfields/inputfields.component';

@Component({
  selector: 'app-createposting',
  templateUrl: './createposting.component.html',
  styleUrls: ['./createposting.component.css']
})
export class CreatepostingComponent implements OnInit {

  enableEmailNotifications : boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  submitPosting(){
    console.log(`from data is ${InputfieldsComponent.postingData.travelDate} 
    origin:  ${InputfieldsComponent.postingData.originCountry} -- ${InputfieldsComponent.postingData.originAirport}
    destination:  ${InputfieldsComponent.postingData.destinationCountry} -- ${InputfieldsComponent.postingData.destinationAirport}
    email notifications ${this.enableEmailNotifications}`)
  }
}
