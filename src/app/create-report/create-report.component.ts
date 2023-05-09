import { Component, OnInit } from '@angular/core';
import * as Papa from 'papaparse';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import axios from 'axios';


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
        const reportData = {
            reportName: reportName,
            studentDetails: studentDetails,
            studentResponses: studentResponses,
            answerKey: answerKey
        };

        console.log("report :  ",reportData);

        this.dataService.setReportData(reportData);

        // Send reportData to server
        fetch('/api/reportData', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(reportData)
          }).then(response => {
            console.log('Response from server:', response);
            response.text().then(text => console.log('Response body:', text));
          }).catch(error => {
            console.error('Error sending report data to server:', error);
          });
          
          
    
      }).catch((error) => {
        console.error(error);
      });
          

        // Navigate to next page
        // this.route.navigateByUrl('result-calculation');

       




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
