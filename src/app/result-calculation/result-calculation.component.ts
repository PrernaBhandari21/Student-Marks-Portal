import { Component,  OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectHeadersComponent } from '../select-headers/select-headers.component';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ApexCharts from 'apexcharts';


@Component({
  selector: 'app-result-calculation',
  templateUrl: './result-calculation.component.html',
  styleUrls: ['./result-calculation.component.css'],

})
export class ResultCalculationComponent implements OnInit {

  omr_response = require("../dummy-data/omr_response.json");
  answer_key = require("../dummy-data/answer_key.json");
  students_data = require("../dummy-data/students-data.json");
  results: any[] = [];
  tableResultant: any;
  tableHeaders: string[] = [];
  headers: string[] = [];
  columnHeaders: string[] = [];
  displayedColumns!: string[];
  dataSource: any;
  totalMarksTopperList: any[]=[];
  maximumTotalMarks: any;





  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    console.log("omr_response ", this.omr_response);
    console.log("answer_key", this.answer_key);
    console.log("students_data", this.students_data);

    this.calcuateResult();




  

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
    console.log("this.omr_response : ", this.omr_response);

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

    console.log(filteredData);


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

      console.log("this.tableResultant : ", this.tableResultant);


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



  // getObjectKeys(obj: any): string[] {
  //   return Object.keys(obj);
  // }




  calcuateResult() {
    for (let i = 0; i < this.omr_response.length; i++) {
      console.log(this.omr_response[i]["Roll No"]);
      let obj: any = {};
      let subject_wise_marks: any = {};
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
          total_right_count +=1;
        } else if (answer) {
          obj[question] = - negative_marks;
          total_wrong_marks -= negative_marks;
          total_marks -= negative_marks;
          total_wrong_count +=1;
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
          }

          if (answer == correct_answer) {
            subject_wise_marks[subject]['Right'] += full_marks;
          } else if (answer) {
            subject_wise_marks[subject]['Wrong'] -= negative_marks;
          } else {
            subject_wise_marks[subject]['Blank'] += 1;
          }

          subject_wise_marks[subject]['Total'] = subject_wise_marks[subject]['Right'] + subject_wise_marks[subject]['Wrong'] + subject_wise_marks[subject]['Blank'];
        }
      }

      //Adding subject-wise marks to the object
      for (let subject in subject_wise_marks) {
        obj['Subject ' + subject + ' Right'] = subject_wise_marks[subject]['Right'];
        obj['Subject ' + subject + ' Wrong'] = subject_wise_marks[subject]['Wrong'];
        obj['Subject ' + subject + ' Blank'] = subject_wise_marks[subject]['Blank'];
        obj['Subject ' + subject + ' Total Marks'] = subject_wise_marks[subject]['Total'];
      }

      //Adding total right, wrong, and blank marks to the object
      obj['Total Right Marks'] = total_right_marks;
      obj['Total Wrong Marks'] = total_wrong_marks;
      obj['Total Marks'] = total_marks;


      //Putting total count of right, wrong and blank
      obj['Total Right Count'] = total_right_count;
      obj['Total Wrong Count'] = total_wrong_count;
      obj['Total Blank Count'] = total_blank_count;

      console.log("Ek bache ka hogya............ab next");
      this.results.push(obj);
    }

    console.log("FINAL>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.results);

    this.calculateRankAndPercentage();

  }





  exportToPdf(): void {
    console.log("exportt..");
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

    console.log("totalMarksTopperList", this.totalMarksTopperList);

    this.initializeChart();

  }

  calculateMaximumTotalMarks() {
    this.maximumTotalMarks = this.answer_key.reduce((totalMarks : number, question: any) => {
      console.log('question["FullMarks"] : ',question["FullMarks"]);
      return totalMarks + question["FullMarks"];
    }, 0);
  }

  calculateRankAndPercentage() {
    this.calculateMaximumTotalMarks();

    console.log(" this.maximumTotalMarks : ", this.maximumTotalMarks);

    // Sort the students based on total marks in descending order
    this.results.sort((a, b) => b["Total Marks"] - a["Total Marks"]);

    // Calculate the rank and percentage for each student
    const totalStudents = this.results.length;
    for (let i = 0; i < totalStudents; i++) {
      const student = this.results[i];
      student["Rank"] = i + 1;

      if(student["Total Marks"] < 0){
        student["Percentage"] =  0;
      }else{
        student["Percentage"] = (student["Total Marks"] / this.maximumTotalMarks) * 100;
      }


    }

    console.log("this.results : ",this.results);
  }


  // personal student report 
  onRowClick(row: any) {
    console.log('Clicked row:', row);
  }


}
