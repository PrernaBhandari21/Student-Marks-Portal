import { Component, OnInit } from '@angular/core';
import * as Papa from 'papaparse';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DataService } from 'src/app/services/data.service';
import { NameService } from 'src/app/services/name.service';
import { ErrorPopupComponent } from 'src/app/error-popup/error-popup.component';


@Component({
  selector: 'app-create-paper-wise-report',
  templateUrl: './create-paper-wise-report.component.html',
  styleUrls: ['./create-paper-wise-report.component.css']
})
export class CreatePaperWiseReportComponent implements OnInit {

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
  studentResponsesForPaperA!: string;
  studentResponsesForPaperB!: string;
  answerKeyForPaperA!: string;
  answerKeyForPaperB!: string;
  // FeedBack1!: string;


  onFileSelected(event: any) {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        console.log('Parsed CSV: ', results.data);
      }
    });
  }
  
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
    const studentResponsesInputForPaperA: HTMLInputElement = <HTMLInputElement>document.getElementById('studentResponsesFileForPaperA');
    const studentResponsesInputForPaperB: HTMLInputElement = <HTMLInputElement>document.getElementById('studentResponsesFileForPaperB');
    const answerKeyInputForPaperA: HTMLInputElement = <HTMLInputElement>document.getElementById('answerKeyFileForPaperA');
    const answerKeyInputForPaperB: HTMLInputElement = <HTMLInputElement>document.getElementById('answerKeyFileForPaperB');
    // const FeedBack1Input: HTMLInputElement = <HTMLInputElement>document.getElementById('FeedBack1File');
     
    // Get report name
    const reportName: string = reportNameInput.value;
  
    // Get student details file
    const studentDetailsFile: File | null = studentDetailsInput.files?.[0] ?? null;
  
    // Get student responses file for Paper A
    const studentResponsesFileForPaperA: File | null = studentResponsesInputForPaperA.files?.[0] ?? null;
    // Get student responses file for Paper B
    const studentResponsesFileForPaperB: File | null = studentResponsesInputForPaperB.files?.[0] ?? null;
  
    // Get answer key file for paper A
    const answerKeyFileForPaperA: File | null = answerKeyInputForPaperA.files?.[0] ?? null;

    // Get answer key file for Paper B
    const answerKeyFileForPaperB: File | null = answerKeyInputForPaperB.files?.[0] ?? null;

    // Get Feedback
    // const FeedBack1File: File | null = FeedBack1Input.files?.[0] ?? null;

  
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
    parseFile(studentResponsesFileForPaperA),
    parseFile(studentResponsesFileForPaperB),
    parseFile(answerKeyFileForPaperA),
    parseFile(answerKeyFileForPaperB),
    // parseFile(FeedBack1File)
  ])
    .then(([studentDetails, studentResponsesFileForPaperA,studentResponsesFileForPaperB,answerKeyFileForPaperA,answerKeyFileForPaperB]) => {
      // Combine form values and parsed file contents into JSON object
      const reportData = {
        reportName: reportName,
        studentDetails: studentDetails,
        studentResponsesFileForPaperA: studentResponsesFileForPaperA,
        studentResponsesFileForPaperB: studentResponsesFileForPaperB,
        answerKeyFileForPaperA: answerKeyFileForPaperA,
        answerKeyFileForPaperB: answerKeyFileForPaperB,
        // FeedBack1File:FeedBack1File
      };

      console.log("report: ", reportData);

      // check for cases where student name is null !!
      const findNoNameRowDetails = this.findNoNameRow(studentDetails);

      // Check for duplicate RollNo in studentDetails
      const duplicateRowsInDetails = this.findDuplicateRollNoRows(studentDetails);

      // Check for duplicate RollNo in studentResponses for paper A
      const duplicateRowsInResponsesForPaperA = this.findDuplicateRollNoRows(studentResponsesFileForPaperA);

      // Check for duplicate RollNo in studentResponses for paper B
      const duplicateRowsInResponsesForPaperB = this.findDuplicateRollNoRows(studentResponsesFileForPaperB);


      if(findNoNameRowDetails.length > 0){
        this.showErrorAndExportExcel(findNoNameRowDetails, 'No Name mentioned for Below Students : ');
        return;
      }

      // Show error popups and export duplicate rows to Excel files, if any
      if (duplicateRowsInDetails.length > 0) {
        this.showErrorAndExportExcel(duplicateRowsInDetails, 'Duplicate RollNo found in Student Details :');
        return;
      }

      if (duplicateRowsInResponsesForPaperA.length > 0) {
        this.showErrorAndExportExcel(duplicateRowsInResponsesForPaperA, 'Duplicate RollNo found in Student Responses. Download Excel with duplicate rows?');
        return;
      }
      if (duplicateRowsInResponsesForPaperB.length > 0) {
        this.showErrorAndExportExcel(duplicateRowsInResponsesForPaperB, 'Duplicate RollNo found in Student Responses. Download Excel with duplicate rows?');
        return;
      }


       // Check if all RollNo values in studentResponses are present in studentDetails
    const studentDetailsRollNos = new Set(studentDetails.map(row => row['RollNo']));
    const missingRollNosInStudentDetails:any = [];

    studentResponsesFileForPaperA.forEach(row => {
      if (!studentDetailsRollNos.has(row['RollNo'])) {
        missingRollNosInStudentDetails.push(row['RollNo']);
      }
    }
    );

    studentResponsesFileForPaperB.forEach(row => {
      if (!studentDetailsRollNos.has(row['RollNo'])) {
        missingRollNosInStudentDetails.push(row['RollNo']);
      }
    }
    );

    if (missingRollNosInStudentDetails.length > 0) {
      // Filter out the rows from studentResponses for paper A that correspond to the missing RollNo values
      const missingRowsInStudentResponsesForPaperA = studentResponsesFileForPaperA.filter(row => missingRollNosInStudentDetails.includes(row['RollNo']));

      console.log("missingRowsInStudentResponses : ", missingRowsInStudentResponsesForPaperA);

      // Filter out the rows from studentResponses For Paper B that correspond to the missing RollNo values
      const missingRowsInStudentResponsesForPaperB = studentResponsesFileForPaperB.filter(row => missingRollNosInStudentDetails.includes(row['RollNo']));

      console.log("missingRowsInStudentResponses : ", missingRowsInStudentResponsesForPaperB);

      const errorMessage = `Following RollNo(s) not found in Student Details.`;
      this.showErrorAndExportExcel(missingRowsInStudentResponsesForPaperA, errorMessage);
      this.showErrorAndExportExcel(missingRowsInStudentResponsesForPaperB, errorMessage);
      return;
    }

    // Data is valid, continue with navigation
    this.dataService.setReportData(reportData);
    this.nameService.setName(reportData.reportName);
    this.route.navigateByUrl('paper-wise-result-calculation');

  


    }).catch((error) => {
        console.error(error);
    });

    
}

showErrorAndExportExcel(excel_data: any[], message: string) {
  const data =  {
    excel_data: excel_data,
    message: message,
  }


  this.dialog.open(ErrorPopupComponent, {
    data:data,
    width:"80%"
  });

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

