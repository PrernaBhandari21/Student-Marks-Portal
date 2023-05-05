import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-header-dialog',
  templateUrl: './header-dialog.component.html',
  styleUrls: ['./header-dialog.component.css']
})
export class HeaderDialogComponent implements OnInit {
  checkboxValues: { [key: string]: boolean } = {};

  constructor(
    public dialogRef: MatDialogRef<HeaderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(){

    console.log("dataaaaaaaaaaaaaaaaaaa : ",this.data);
  }
  getSelectedValues(): { header: string, values: string[] } {
    const selectedValues = Object.keys(this.checkboxValues).filter(value => this.checkboxValues[value]);
    console.log( { header: this.data.header, values: selectedValues });

    return { header: this.data.header, values: selectedValues };
  }


  
  onOkClick(): void {
    const selectedData = this.getSelectedValues();
  
    // Convert the selectedData.header to string
    const headerString = String(selectedData.header);
  
    // Filter the rows based on the selected values
    const filteredRows = this.data.dataSource.filteredData.filter((row: any) => {
      // Convert the row[selectedData.header] to string for comparison
      const rowHeaderValue = String(row[selectedData.header]);
  
      return selectedData.values.includes(rowHeaderValue);
    });
  
    console.log('Filtered Rows:', filteredRows);
  
    this.dialogRef.close({
      newDataSource: filteredRows
    });
  }
  
  
  

  onCancelClick(): void {
    this.dialogRef.close();
  }
}


