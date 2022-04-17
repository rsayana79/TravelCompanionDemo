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


@Component({
  selector: 'app-bookings-data',
  templateUrl: './bookings-data.component.html',
  styleUrls: ['./bookings-data.component.css']
})
export class BookingsDataComponent implements OnInit {

  postings: Posting[];
  defaultDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  displayedColumns: string[] = ['travelDate', 'originCountry', 'originAirport', 'destinationCountry', 'destinationAirport'];
  dataSource: MatTableDataSource<Posting>;


  constructor(private countryService: CountryService, private airportService: AirportService,
    private postingService: PostingService, private datePipe: DatePipe,
    private liveAnnouncer: LiveAnnouncer) { }


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
}
