import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatDatepickerModule, MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {

  dateSelected = new Date();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
