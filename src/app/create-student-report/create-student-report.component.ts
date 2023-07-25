import { Component, OnInit } from '@angular/core';
import * as Papa from 'papaparse';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import axios from 'axios';
import { NameService } from '../services/name.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectReportComponent } from '../select-report/select-report.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-create-student-report',
  templateUrl: './create-student-report.component.html',
  styleUrls: ['./create-student-report.component.css']
})
export class CreateStudentReportComponent implements OnInit {

  constructor(
    private dataService : DataService,
    private route : Router,
    private nameService : NameService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }


  reportName!: string;
  studentDetails!: string;
  studentResponses!: string;
  answerKey!: string;


  onFileSelected(event: any) {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        console.log('Parsed CSV: ', results.data);
      }
    });
  }
  
  // Function to find duplicate RollNo rows in the parsed data
findDuplicateRollNoRows(data: any[]): any[] {
  const duplicateRows: any[] = [];
  const rollNoSet = new Set(); // Use a Set to keep track of seen RollNo values

  data.forEach((row) => {
    if (row['RollNo']) {
      if (rollNoSet.has(row['RollNo'])) {
        duplicateRows.push(row);
      } else {
        rollNoSet.add(row['RollNo']);
      }
    }
  });

  return duplicateRows;
}

findNoNameRow(studentsData: any[]): any[] {
  const noNameRows: any[] = [];

  studentsData.forEach((row) => {
    if (!row['Student Name']) {
      noNameRows.push(row);
    }
  });

  return noNameRows;
}

  submitForm() {
    // Get form input elements
    const reportNameInput: HTMLInputElement = <HTMLInputElement>document.getElementById('reportName');
    const studentDetailsInput: HTMLInputElement = <HTMLInputElement>document.getElementById('studentDetailsFile');
    const studentResponsesInput: HTMLInputElement = <HTMLInputElement>document.getElementById('studentResponsesFile');
    const answerKeyInput: HTMLInputElement = <HTMLInputElement>document.getElementById('answerKeyFile');
  
    // Get report name
    const reportName: string = reportNameInput.value;
  
    // Get student details file
    const studentDetailsFile: File | null = studentDetailsInput.files?.[0] ?? null;
  
    // Get student responses file
    const studentResponsesFile: File | null = studentResponsesInput.files?.[0] ?? null;
  
    // Get answer key file
    const answerKeyFile: File | null = answerKeyInput.files?.[0] ?? null;
  
    // Parse file contents to JSON using Papa Parse
    const parseFile = (file: File | null): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve([]);
            } else {
                Papa.parse(file, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true, 
                    complete: (results) => {
                        const data = results.data;
                        resolve(data);
                    },
                    error: (error) => {
                        reject(error);
                    }
                });
            }
        });
    };
  // Parse all files
  Promise.all([
    parseFile(studentDetailsFile),
    parseFile(studentResponsesFile),
    parseFile(answerKeyFile)
  ])
    .then(([studentDetails, studentResponses, answerKey]) => {
      // Combine form values and parsed file contents into JSON object
      const reportData = {
        reportName: reportName,
        studentDetails: studentDetails,
        studentResponses: studentResponses,
        answerKey: answerKey
      };

      console.log("report: ", reportData);

      // check for cases where student name is null !!
      const findNoNameRowDetails = this.findNoNameRow(studentDetails);

      // Check for duplicate RollNo in studentDetails
      const duplicateRowsInDetails = this.findDuplicateRollNoRows(studentDetails);

      // Check for duplicate RollNo in studentResponses
      const duplicateRowsInResponses = this.findDuplicateRollNoRows(studentResponses);


      if(findNoNameRowDetails.length > 0){
        this.showErrorAndExportExcel(findNoNameRowDetails, 'No Name mentioned for Students . Download Excel for reference');
        return;
      }

      // Show error popups and export duplicate rows to Excel files, if any
      if (duplicateRowsInDetails.length > 0) {
        this.showErrorAndExportExcel(duplicateRowsInDetails, 'Duplicate RollNo found in Student Details. Download Excel with duplicate rows?');
        return;
      }

      if (duplicateRowsInResponses.length > 0) {
        this.showErrorAndExportExcel(duplicateRowsInResponses, 'Duplicate RollNo found in Student Responses. Download Excel with duplicate rows?');
        return;
      }

      // Data is valid, continue with navigation
      this.dataService.setReportData(reportData);
      this.nameService.setName(reportData.reportName);
      this.route.navigateByUrl('student-result-calculation');


    }).catch((error) => {
        console.error(error);
    });

    
}

showErrorAndExportExcel(duplicateRows: any[], message: string) {
  // Show error popup
  const userConfirmed = window.confirm(message);

  if (userConfirmed) {
    // Export duplicate rows to an Excel file
    this.exportToExcel(duplicateRows);
  }
}

exportToExcel(duplicateRows: any[]) {
  // Create a new Excel workbook and worksheet
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(duplicateRows);
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



// const { Client } = require('pg');

// const client = new Client({
//   user: 'your_username',
//   host: 'your_host',
//   database: 'your_database_name',
//   password: 'your_password',
//   port: 5432, // the default port for PostgreSQL
// });

// await client.connect();

// const answerKey = [{...}, {...}, {...}, ...];
// const reportName = 'q';
// const studentDetails = [{...}, {...}, {...}, ...];
// const studentResponses = [{...}, {...}, {...}, ...];

// const query = 'INSERT INTO your_table_name (answer_key, report_name, student_details, student_responses) VALUES ($1, $2, $3, $4)';

// const values = [answerKey, reportName, studentDetails, studentResponses];

// await client.query(query, values);

// await client.end();

