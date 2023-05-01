import { Component,  ElementRef,  OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectHeadersComponent } from '../select-headers/select-headers.component';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import * as ApexCharts from 'apexcharts';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-result-calculation',
  templateUrl: './result-calculation.component.html',
  styleUrls: ['./result-calculation.component.css'],

})
export class ResultCalculationComponent implements OnInit {

  omr_response = require("../dummy-data/omr_response.json");
  answer_key = require("../dummy-data/answer_key.json");
  students_all_data = require("../dummy-data/students-data.json");
  results: any[] = [];
  tableResultant: any;
  tableHeaders: string[] = [];
  headers: string[] = [];
  columnHeaders: string[] = [];
  displayedColumns!: string[];
  dataSource: any;
  totalMarksTopperList: any[]=[];
  maximumTotalMarks: any;
  students_data : any;
  percentagesValues: any;

  constructor(private dialog: MatDialog,
    private elementRef: ElementRef,
    private router : Router,
    private dataService : DataService) { }

 async ngOnInit() {
    this.removeSNo();

    console.log("omr_response ", this.omr_response);
    console.log("answer_key", this.answer_key);
    console.log("students_data", this.students_data);

    this.calcuateResult();
  }

  removeSNo(){
    const filteredData = this.students_all_data.map((item: { [x: string]: any; hasOwnProperty: (arg0: string) => any; }) => {
      const filteredItem :any= {};
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          const formattedKey = key.toLowerCase().replace(/\s|\.|_/g, '');
          if (formattedKey !== 'sno' && formattedKey !== 'sno') {
            filteredItem[key] = item[key];
          }
        }
      }
      return filteredItem;
    });
    this.students_data = filteredData;
    
  }

  initializeChart() {
    const chartOptions = {
      chart: {
        type: 'bar',
        height: 400
      },
      series: [{
        name: 'Sales',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
      }],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
      }
    };

    const chart = new ApexCharts(document.querySelector('#chart'), chartOptions);
    chart.render();
  }




  openPopup(): void {
    // console.log("this.omr_response : ", this.omr_response);

    // Filter out headers starting with "Q" followed by a numerical value
    const filteredData = this.omr_response.map((dataObj: { [x: string]: any; }) => {
      const filteredObj: any = {};
      for (const key in dataObj) {
        if (!(key.startsWith("Q") && /\d/.test(key))) {
          filteredObj[key] = dataObj[key];
        }
      }
      return filteredObj;
    });

    // console.log(filteredData);


    const dialogRef = this.dialog.open(SelectHeadersComponent, {
      width: '60%',

      data: {
        omrResponseData: filteredData,
        answerKeyData: this.answer_key,
        studentsData: this.students_data,
        omrResponseHeaders: Object.keys(filteredData[0]),
        answerKeyHeaders: Object.keys(this.answer_key[0]),
        studentsDataHeaders: Object.keys(this.students_data[0]),
        resultData: this.results,
        resultDataHeaders: Object.keys(this.results[0]),
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      this.tableResultant = result;

      // console.log("this.tableResultant : ", this.tableResultant);


      this.headers = Object.keys(this.tableResultant);

      this.dataSource = this.convertToDataSource();

      
      if (this.headers.includes('Total Marks')) {
          this.getToppersWithHighTotalMarks();
        }


    });




  }

  convertToDataSource() {
    const data = [];
    const properties = Object.keys(this.tableResultant);
    const randomProperty = properties[Math.floor(Math.random() * properties.length)];
    const length = this.tableResultant[randomProperty].length;

    for (let i = 0; i < length; i++) {
      const row: any = {};
      for (const key in this.tableResultant) {
        row[key] = this.tableResultant[key][i];
      }
      data.push(row);
    }

    return data;
  }






  calcuateResult() {
    for (let i = 0; i < this.omr_response.length; i++) {
      // console.log(this.omr_response[i]["Roll No"]);
      let obj: any = {};
      let subject_wise_marks: any = {};
      let subject_wise_count: any = {}; // Add subject_wise_count object
      let total_right_marks = 0;
      let total_wrong_marks = 0;
      let total_marks = 0;
      let total_right_count = 0;
      let total_wrong_count = 0;
      let total_blank_count = 0;
  
      //Adding Roll No in results array
      obj["Roll No"] = this.omr_response[i]["Roll No"];
  
      for (let j = 0; j < this.answer_key.length; j++) {
        let question = "Q" + (j + 1);
        let answer = this.omr_response[i][question];
        let correct_answer = this.answer_key[j].AnswerKey;
        let full_marks = this.answer_key[j].FullMarks;
        let partial_marks = this.answer_key[j]["Partial Marks"];
        let negative_marks = this.answer_key[j]["Negative Marks"];
        let subject = this.answer_key[j].Subject;
  
        // Adding values for headers like Q1, Q2....so on
        if (answer == correct_answer) {
          obj[question] = full_marks;
          total_right_marks += full_marks;
          total_marks += full_marks;
          total_right_count += 1;
        } else if (answer) {
          obj[question] = -negative_marks;
          total_wrong_marks -= negative_marks;
          total_marks -= negative_marks;
          total_wrong_count += 1;
        } else {
          obj[question] = 0;
          total_blank_count += 1;
        }
  
        //Adding values for subject-wise headers
        if (subject) {
          if (!subject_wise_marks[subject]) {
            subject_wise_marks[subject] = {};
            subject_wise_marks[subject]['Right'] = 0;
            subject_wise_marks[subject]['Wrong'] = 0;
            subject_wise_marks[subject]['Blank'] = 0;
            subject_wise_marks[subject]['Total'] = 0;
            subject_wise_count[subject] = {}; // Initialize subject_wise_count object
            subject_wise_count[subject]['Right'] = 0;
            subject_wise_count[subject]['Wrong'] = 0;
            subject_wise_count[subject]['Blank'] = 0;
          }
  
          if (answer == correct_answer) {
            subject_wise_marks[subject]['Right'] += full_marks;
            subject_wise_count[subject]['Right'] += 1; // Increment right count
          } else if (answer) {
            subject_wise_marks[subject]['Wrong'] -= negative_marks;
            subject_wise_count[subject]['Wrong'] += 1; // Increment wrong count
          } else {
            subject_wise_marks[subject]['Blank'] += 1;
            subject_wise_count[subject]['Blank'] += 1; // Increment blank count
          }
  
          subject_wise_marks[subject]['Total'] = subject_wise_marks[subject]['Right'] + subject_wise_marks[subject]['Wrong'] + subject_wise_marks[subject]['Blank'];
        }
      }
  
      //Adding subject-wise marks and count to the object
      for (let subject in subject_wise_marks) {
        obj['Subject ' + subject + ' Right Count'] = subject_wise_count[subject]['Right']; // Subject-wise right count
        obj['Subject ' + subject + ' Wrong Count'] = subject_wise_count[subject]['Wrong']; // Subject-wise wrong count
        obj['Subject ' + subject + ' Blank Count'] = subject_wise_count[subject]['Blank']; // Subject-wise blank count
  
        obj['Subject ' + subject + ' Right'] = subject_wise_marks[subject]['Right']; // Subject-wise right marks
        obj['Subject ' + subject + ' Wrong'] = subject_wise_marks[subject]['Wrong']; // Subject-wise wrong marks
        obj['Subject ' + subject + ' Blank'] = subject_wise_marks[subject]['Blank']; // Subject-wise blank marks
        obj['Subject ' + subject + ' Total Marks'] = subject_wise_marks[subject]['Total']; // Subject-wise total marks
      }
  
      //Adding total right, wrong, and blank marks to the object
      obj['Total Right Marks'] = total_right_marks;
      obj['Total Wrong Marks'] = total_wrong_marks;
      obj['Total Marks'] = total_marks;
  
      //Putting total count of right, wrong, and blank
      obj['Total Right Count'] = total_right_count;
      obj['Total Wrong Count'] = total_wrong_count;
      obj['Total Blank Count'] = total_blank_count;
  
      // console.log("Ek bache ka hogya............ab next");
      this.results.push(obj);
    }
  
    console.log("FINAL>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.results);
  
    this.calculateRankAndPercentage();
  }

  calculateRankAndPercentage() {
    this.calculateMaximumTotalMarks();
  
    // Sort the students based on total marks in descending order
    this.results.sort((a, b) => b["Total Marks"] - a["Total Marks"]);
  
    // Calculate the rank and percentage for each student
    const totalStudents = this.results.length;
    let totalPercentage = 0;
    let lowestPercentage = Infinity;
    let highestPercentage = -Infinity;
  
    for (let i = 0; i < totalStudents; i++) {
      const student = this.results[i];
      student["Rank"] = i + 1;
  
      if (student["Total Marks"] < 0) {
        student["Percentage"] = 0;
      } else {
        student["Percentage"] = (student["Total Marks"] / this.maximumTotalMarks) * 100;
        totalPercentage += student["Percentage"];
        lowestPercentage = Math.min(lowestPercentage, student["Percentage"]);
        highestPercentage = Math.max(highestPercentage, student["Percentage"]);
      }
    }
  
    const averagePercentage = totalPercentage / totalStudents;
    this.percentagesValues = {
      lowestPercentage : lowestPercentage,
      highestPercentage : highestPercentage,
      averagePercentage : averagePercentage
    }
    console.log("Lowest Percentage:", lowestPercentage);
    console.log("Highest Percentage:", highestPercentage);
    console.log("Average Percentage:", averagePercentage);
  }
    


  

  




  exportToPdf(): void {
    // console.log("exportt..");
    const doc = new jsPDF();

    const tableData = [];
    const headerRow = [];

    for (const header of this.headers) {
      headerRow.push(header);
    }

    tableData.push(headerRow);

    for (const element of this.dataSource) {
      const dataRow = [];
      for (const header of this.headers) {
        dataRow.push(element[header]);
      }
      tableData.push(dataRow);
    }

    autoTable(doc, {
      head: tableData.slice(0, 1),
      body: tableData.slice(1),
    });

    doc.save('table_data.pdf');
  }

  exportToCsv(): void {
    const csvRows = [];

    // Header row
    const headerRow = this.headers.join(',');
    csvRows.push(headerRow);

    // Data rows
    for (const element of this.dataSource) {
      const dataRow = [];
      for (const header of this.headers) {
        const value = element[header];
        const csvValue = value !== null && value !== undefined ? value.toString() : '';
        dataRow.push(csvValue);
      }
      const csvRow = dataRow.join(',');
      csvRows.push(csvRow);
    }

    // Generate CSV content
    const csvContent = csvRows.join('\n');

    // Create a Blob object and a temporary link element
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Set link properties
    link.href = url;
    link.download = 'table_data.csv';

    // Append the link to the document and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }




  //Get Top 5 students who have higher Total Marks !
  getToppersWithHighTotalMarks() {
    // Select a random property name from tableResultant
    const randomProperty = Object.keys(this.tableResultant)[Math.floor(Math.random() * Object.keys(this.tableResultant).length)];

    // Convert the selected property into an array of objects
    const students = this.tableResultant[randomProperty].map((value: any, index: any) => {
      const student: any = {};
      for (const key in this.tableResultant) {
        if (Object.prototype.hasOwnProperty.call(this.tableResultant, key)) {
          student[key] = this.tableResultant[key][index];
        }
      }
      return student;
    });

    // Sort the students array based on the total marks in descending order
    students.sort((a: any, b: any) => b['Total Marks'] - a['Total Marks']);

    // Retrieve the top 5 students from the sorted array
    this.totalMarksTopperList = students.slice(0, 5);

    // console.log("totalMarksTopperList", this.totalMarksTopperList);

    this.initializeChart();

  }

  calculateMaximumTotalMarks() {
    this.maximumTotalMarks = this.answer_key.reduce((totalMarks : number, question: any) => {
      // console.log('question["FullMarks"] : ',question["FullMarks"]);
      return totalMarks + question["FullMarks"];
    }, 0);
  }


  






//Adding S No manually !
  getHeaderRowDef(): string[] {
    return ['sno', ...this.headers];
  }

  getRowDef(): string[] {
    return ['sno', ...this.headers];
  }




  // personal student report 
  onRowClick(row: any) {
    console.log('Clicked row:', row);

      // Find the result for the clicked roll number
      const clickedRollNo = row["Roll No"]; // Convert the roll number to a number
      const rollNoResult = this.results.find(result => result["Roll No"] === parseInt(clickedRollNo));
      const studentData = this.students_data.find((student: { [x: string]: number; }) => student["Roll No"]===clickedRollNo);



      if (rollNoResult) {
        // Result found
        console.log("Result:", rollNoResult);
        console.log("Student Data : ", studentData);
        const studentReportData : any = {
          resultData : rollNoResult,
          studentPersonalInfo : studentData,
          percentagesValue : this.percentagesValues
        }
        this.dataService.setClickedRow(studentReportData);
        this.router.navigate(['/student-personal-report']);
      } else {
        // Result not found
        alert("Report Not Found. Make sure you have selected Student's Roll No. !")
      }
    }

  //Download whole page !
  downloadPage() {
    const doc = new jsPDF();

    const elementToCapture = this.elementRef.nativeElement.querySelector('.component-to-download');

    html2canvas(elementToCapture, { useCORS: true }).then(canvas => {
      const imageData = canvas.toDataURL('image/png');

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 4;

      const imgWidth = pageWidth - (2 * margin);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const xPos = margin;
      const yPos = margin;

      doc.addImage(imageData, 'PNG', xPos, yPos, imgWidth, imgHeight);
      doc.save('component.pdf');
    });
  }


}
