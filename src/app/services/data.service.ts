import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  clickedRow: any;
  reportData: any;

  setClickedRow(rowData: any): void {
    this.clickedRow = rowData;
  }

  getClickedRow(): any {
    return this.clickedRow;
  }

  setReportData(reportData: any): void {
    this.reportData = reportData;
  }

  getReportData(): any {
    return this.reportData;
  }
}
