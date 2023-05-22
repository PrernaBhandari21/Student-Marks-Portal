import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SelectReportComponent } from '../select-report/select-report.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(
    private router : Router,
    private dialog : MatDialog,
    
  ) { }

  ngOnInit(): void {
  }


  openCreateReportComp(){
    console.log("opening create report component");
      this.router.navigate(['create-report']);

  }

  openSelectReport(){
    const dialogRef = this.dialog.open(SelectReportComponent, {
      width: '45%',

      });
  }

}
