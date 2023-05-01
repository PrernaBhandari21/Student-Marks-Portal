import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  clickedRow: any;

  setClickedRow(rowData: any): void {
    this.clickedRow = rowData;
  }

  getClickedRow(): any {
    return this.clickedRow;
  }
}
