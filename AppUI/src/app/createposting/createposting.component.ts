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
    console.log(`from data is ${InputfieldsComponent.postingData.traveldate} 
    origin:  ${InputfieldsComponent.postingData.origincountry} -- ${InputfieldsComponent.postingData.originairport}
    destination:  ${InputfieldsComponent.postingData.destinationcountry} -- ${InputfieldsComponent.postingData.destinationairport}
    email notifications ${this.enableEmailNotifications}`)
  }
}
