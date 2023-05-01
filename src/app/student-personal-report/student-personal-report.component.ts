import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-student-personal-report',
  templateUrl: './student-personal-report.component.html',
  styleUrls: ['./student-personal-report.component.css']
})
export class StudentPersonalReportComponent implements OnInit {

  data : any;

  constructor(private dataService : DataService) { }



  ngOnInit(): void {
    this.getStudentData();
  }


  getStudentData(){
    this.data = this.dataService.getClickedRow();

    console.log("FINALLY THE STUDENT DATA IS : ", this.data);
  }
}
