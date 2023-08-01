import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-paper-wise-result-calculation',
  templateUrl: './paper-wise-result-calculation.component.html',
  styleUrls: ['./paper-wise-result-calculation.component.css']
})
export class PaperWiseResultCalculationComponent implements OnInit {

  constructor(private dataService : DataService) { }

  async ngOnInit() {
    await this.getPaperWiseData();
  }

  getPaperWiseData(){
    const reportData = this.dataService.getReportData();
    console.log("Got reportData : ", reportData);
  }

}
