import { Component, OnInit , Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.css']
})
export class ErrorPopupComponent implements OnInit {


  errorMessage: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    tableData : any[] = [];
    displayedColumns: string[] = [];

    
  ngOnInit(): void {
    console.log("Show error",this.data);
    this.errorMessage = this.data?.message;
    this.tableData = this.data?.excel_data;

    if (this.tableData.length > 0) {
      this.displayedColumns = Object.keys(this.tableData[0]);
    }

  }


  exportToExcel() {
    // Create a new Excel workbook and worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data?.excel_data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  
    // Convert the workbook to an Excel binary array
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Convert the Excel binary array to a Blob
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
  
    // Save the Blob as an Excel file
    saveAs(data, 'Reference.xlsx'); // Save the Excel file with a given name
  }

}
