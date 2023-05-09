import { Component, OnInit } from '@angular/core';
import * as Papa from 'papaparse';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css']
})
export class CreateReportComponent implements OnInit {

  constructor(
    private dataService : DataService,
    private route : Router
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

    // Check if all required fields have been filled out
    if (!reportName || !studentDetailsFile || !studentResponsesFile || !answerKeyFile) {
        alert("Please fill out all required fields before submitting the form.");
        return;
    }

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
    ]).then(([studentDetails, studentResponses, answerKey]) => {
        // Combine form values and parsed file contents into JSON object
        const report = {
            reportName: reportName,
            studentDetails: studentDetails,
            studentResponses: studentResponses,
            answerKey: answerKey
        };

        console.log("report :  ",report);

        this.dataService.setReportData(report);

        // Navigate to next page
        // this.route.navigate(['result-calculation']);
        this.route.navigateByUrl('result-calculation');

        // Download report data as a JSON file
        // const jsonData = JSON.stringify(report, null, 2);
        // const blob = new Blob([jsonData], { type: 'application/json' });
        // const link = document.createElement('a');
        // link.href = URL.createObjectURL(blob);
        // link.download = `${reportName}.json`;
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);

    }).catch((error) => {
        console.error(error);
    });
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
