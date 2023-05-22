import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NameService } from '../services/name.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-select-report',
  templateUrl: './select-report.component.html',
  styleUrls: ['./select-report.component.css']
})
export class SelectReportComponent implements OnInit {
  reportName: any = '';
  selectedData: any;
  reportData: any; // variable to store the retrieved data

  constructor(private http : HttpClient,
    private nameService : NameService,
    public dialogRef: MatDialogRef<SelectReportComponent>,
    private dataService : DataService,
    private router : Router
    ) { }

  ngOnInit(): void {
    this.getReportData();
  }

  async getReportData() {
    this.reportName = await this.nameService.getName();
    console.log(this.reportName);
  
    const url = `http://localhost:4200/api/reportData`;
  
    try {
      const data = await this.http.get(url).toPromise();
      this.reportData = data;
      console.log('Received report data:', this.reportData);
  
      // const finalDbData = this.reportData;
      // console.log(finalDbData);
      // console.log("finalDbData.studentDetails", finalDbData.studentDetails);
      // console.log("finalDbData.answerKey", finalDbData.answerKey);
      // console.log("finalDbData.studentResponse", finalDbData.studentResponse);
  
    } catch (error) {
      console.error('Error retrieving report data:', error);
    }
  }
  

 async showSelectedData() {
  if(this.selectedData){
    this.dataService.setReportData(this.selectedData);
    this.dialogRef.close();
    this.router.navigate(['result-calculation']);

  }    
  }

  closePopup(){
    this.dialogRef.close();
  }

}
