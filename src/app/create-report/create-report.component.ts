import { Component, OnInit } from '@angular/core';
import * as Papa from 'papaparse';
import * as fs from 'fs-extra';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css']
})
export class CreateReportComponent implements OnInit {

  constructor() { }

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
  
      // Convert report data to JSON
      const jsonData = JSON.stringify(report, null, 2);
  
      // Create a new Blob object with the JSON data
      const blob = new Blob([jsonData], { type: 'application/json' });
  
      // Create a link element to download the file
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${reportName}.json`;
  
      // Click the link to download the file
      link.click();
    }).catch((error) => {
      console.error(error);
    });
  }
  
  
  
  
  
  
  

}
