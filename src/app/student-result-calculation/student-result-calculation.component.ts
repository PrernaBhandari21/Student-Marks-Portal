import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectHeadersComponent } from '../select-headers/select-headers.component';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { HeaderDialogComponent } from '../header-dialog/header-dialog.component';
import { HttpClient } from '@angular/common/http';
import { NameService } from '../services/name.service';


@Component({
  selector: 'app-student-result-calculation',
  templateUrl: './student-result-calculation.component.html',
  styleUrls: ['./student-result-calculation.component.css']
})
export class StudentResultCalculationComponent implements OnInit {

  reportData: any; // variable to store the retrieved data

  // omr_response = require("../dummy-data/omr_response.json");
  // answer_key = require("../dummy-data/answer_key.json");
  // students_all_data = require("../dummy-data/students-data.json");
  omr_response:any;
  answer_key:any;
  students_all_data:any;
  results: any[] = [];
  tableResultant: any;
  tableHeaders: string[] = [];
  headers: string[] = [];
  columnHeaders: string[] = [];
  displayedColumns!: string[];
  dataSource: any;
  totalMarksTopperList: any[] = [];
  maximumTotalMarks: any;
  students_data: any;
  percentagesValues: any;
  peerAverageRightCount: any = {};
  peerAverageCounts: any = {};
  subjectWiseMarks: any = {};
  topCandidates :any= [];
  resultObject:any = {};
  tempDataSource : any;

  sortDirection: { [key: string]: boolean } = {}; // create an object to keep track of the sorting order for each column
  reportName: any = '';



  constructor(private dialog: MatDialog,
    private elementRef: ElementRef,
    private router: Router,
    private dataService: DataService,
    private http: HttpClient,
    private nameService : NameService) { }

  async ngOnInit() {
    await this.getReportData();
    console.log("omr_response ", this.omr_response);
    console.log("answer_key", this.answer_key);
    // console.log("students_data", this.students_data);

    // this.removeSNo();
    this.calcuateResult();

    // this.toppersList();
  }

  async getReportData(){

    //Gettin data without database !!
   const data = await this.dataService.getReportData();
    console.log("dataaaaaaaaaa : ", data);

    // this.students_all_data = data.studentDetails;
    this.answer_key = data.answerKey;
    this.omr_response = data.studentResponses;


  // this.reportData = await this.dataService.getReportData();


  // try {
  //   console.log('Received report data:', this.reportData);
  //   this.reportName = this.reportData.name;

  //   if(this.reportData){
  //     this.students_all_data = await this.reportData.studentDetails;
  //     this.answer_key = await this.reportData.answerKey;
  //     this.omr_response = await this.reportData.studentResponse;
  //   }


  // } catch (error) {
  //   console.error('Error retrieving report data:', error);
  // }

  }  

  sort(header: string) {
    const data = this.dataSource.filteredData.slice();
    const isNumeric = !isNaN(parseFloat(data[0][header])) && isFinite(data[0][header]);
    
    // toggle the sorting order for the current column
    this.sortDirection[header] = !this.sortDirection[header];
    
    if (isNumeric) {
      data.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
        if (this.sortDirection[header]) {
          return a[header] - b[header]; // sort in ascending order
        } else {
          return b[header] - a[header]; // sort in descending order
        }
      });
    } else {
      data.sort((a: { [x: string]: any; }, b: { [x: string]: string; }) => {
        if (this.sortDirection[header]) {
          return a[header].localeCompare(b[header]); // sort in ascending order
        } else {
          return b[header].localeCompare(a[header]); // sort in descending order
        }
      });
    }
    
    this.dataSource.data = data;
  }
  

  removeSNo() {
    const filteredData = this.students_all_data.map((item: { [x: string]: any; hasOwnProperty: (arg0: string) => any; }) => {
      const filteredItem: any = {};
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
        // studentsData: this.students_data,
        omrResponseHeaders: Object.keys(filteredData[0]),
        answerKeyHeaders: Object.keys(this.answer_key[0]),
        // studentsDataHeaders: Object.keys(this.students_data[0]),
        resultData: this.results,
        resultDataHeaders: Object.keys(this.results[0]),
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      this.tableResultant = result;

      // console.log("this.tableResultant : ", this.tableResultant);


      this.headers = Object.keys(this.tableResultant);

      this.dataSource = new MatTableDataSource(this.convertToDataSource());
      console.log("this.dataSource : ",this.dataSource);
      this.tempDataSource = this.dataSource;
      // console.log("this.tempDataSource : ",this.tempDataSource);
      // console.log("DATA SOURCE : ",this.dataSource);




    


    });




  }

  

  convertToDataSource() {
    if (!this.tableResultant) {
      return [];
    }
  
    const data = [];
    const properties = Object.keys(this.tableResultant);
    const length = this.tableResultant[properties[0]].length; // Get the length from one of the properties
  
    for (let i = 0; i < length; i++) {
      const row: any = {};
      for (const key in this.tableResultant) {
        row[key] = this.tableResultant[key][i];
      }
      data.push(row);
    }
  
    // Sort the data based on the "RollNo" property
    data.sort((a, b) => a["RollNo"] - b["RollNo"]);
  
    return data;
  }
  






  calcuateResult() {

    const questionStats :any = {}; // Object to store question statistics
    for (let i = 0; i < this.omr_response.length; i++) {
      let obj: any = {};
      let subject_wise_marks: any = {};
      let subject_wise_count: any = {}; // Add subject_wise_count object
      let total_right_marks = 0;
      let total_wrong_marks = 0;
      let total_marks = 0;
      let total_right_count = 0;
      let total_wrong_count = 0;
      let total_blank_count = 0;

    


      //Adding RollNo in results array
      obj["RollNo"] = this.omr_response[i]["RollNo"];

      console.log("obj['RollNo']", obj["RollNo"]);
      console.log('this.omr_response[i]["RollNo"]', this.omr_response[i]["RollNo"]);

      for (let j = 0; j < this.answer_key.length; j++) {


        let question = "Q" + (j + 1);
        let answer = this.omr_response[i][question];
        let correct_answer = this.answer_key[j].AnswerKey;
        let full_marks = this.answer_key[j].FullMarks;
        let partial_marks = this.answer_key[j]["Partial Marks"];
        let negative_marks = this.answer_key[j]["Negative Marks"];

        let subject = this.answer_key[j].Subject;


      if (!questionStats[question]) {
        questionStats[question] = {
          "Total Right": 0,
          "Total Wrong": 0,
          "Total Blank": 0
        };
      }

        // Adding values for headers like Q1, Q2....so on
        if (answer == correct_answer) {
          obj[question] = full_marks;
          total_right_marks += full_marks;
          total_marks += full_marks;
          total_right_count += 1;
        } else if (answer) {
          obj[question] = negative_marks;
          total_wrong_marks += negative_marks;
          total_marks += negative_marks;
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

            questionStats[question]["Total Right"]++;

          } else if (answer) {
            subject_wise_marks[subject]['Wrong'] += negative_marks;
            subject_wise_count[subject]['Wrong'] += 1; // Increment wrong count
            questionStats[question]["Total Wrong"]++;

          } else {
            subject_wise_marks[subject]['Blank'] -= partial_marks;
            subject_wise_count[subject]['Blank'] += 1; // Increment blank count

            questionStats[question]["Total Blank"]++;

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
        obj['Subject ' + subject + ' Total Marks'] =parseFloat(subject_wise_marks[subject]['Total']); // Subject-wise total marks
        

        // Calculate Subject Percentage
        const subjectMaxMarks = this.answer_key.filter((item: { Subject: string; }) => item.Subject === subject)
          .reduce((total: any, item: { FullMarks: any; }) => total + item.FullMarks, 0);
        const subjectRightMarks = subject_wise_marks[subject]['Right'];
        const subjectPercentage = (subjectRightMarks / subjectMaxMarks) * 100;
        obj['Subject ' + subject + ' Percentage'] = subjectPercentage;

        // Calculate Total Questions in Subject
        const subjectTotalQuestions = this.answer_key.filter((item: { Subject: string; }) => item.Subject === subject).length;
        obj['Subject ' + subject + ' Total Questions'] = subjectTotalQuestions;

        // Calculate Subject Rank
        const ranks = this.results.map((result: any) => result['Subject ' + subject + ' Percentage']);
        const subjectRank = ranks.filter((rank: number) => rank >= subjectPercentage).length + 1;
        obj['Subject ' + subject + ' Rank'] = subjectRank;

      }

      //Adding total right, wrong, and blank marks to the object
      obj['Total Right Marks'] = total_right_marks;
      obj['Total Wrong Marks'] = total_wrong_marks;
      obj['Total Marks'] = total_marks;

      //Putting total count of right, wrong, and blank
      obj['Total Right Count'] = total_right_count;
      obj['Total Wrong Count'] = total_wrong_count;
      obj['Total Blank Count'] = total_blank_count;

      // console.log("Done for 1 student............ab next");
      // this.results.push(obj);
      console.log("i =>",i);
      this.results[i] = obj;
      console.log(" obj , ",  obj);
    }

    



    // Calculate percentages and store in the result object
  const totalStudents = this.omr_response.length;
  for (const question in questionStats) {
    const totalRight = questionStats[question]["Total Right"];
    const totalWrong = questionStats[question]["Total Wrong"];
    const totalBlank = questionStats[question]["Total Blank"];

    const totalRightPercentage = (totalRight / totalStudents) * 100;
    const totalWrongPercentage = (totalWrong / totalStudents) * 100;
    const totalBlankPercentage = (totalBlank / totalStudents) * 100;

    this.resultObject[`${question} Total Right`] = totalRightPercentage;
    this.resultObject[`${question} Total Wrong`] = totalWrongPercentage;
    this.resultObject[`${question} Total Blank`] = totalBlankPercentage;
  }

  // console.log(this.resultObject);





    console.log("FINAL>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.results);

    this.calculateRankAndPercentage();
    this.calculatePeerAverageCount();
    this.calculateSubjectWiseMarks();
    // this.calculatePeerCountBySubject();

    
  }

  calculateRankAndPercentage() {
    this.calculateMaximumTotalMarks();
  
    // Calculate the rank and percentage for each student
    const totalStudents = this.results.length;
    let totalPercentage = 0;
    let lowestPercentage = Infinity;
    let highestPercentage = -Infinity;
  
    let previousTotalMarks = null;
    let currentRank = 0;
    let currentPercentageRank = 0;
  
    // Sort the students based on total marks temporarily
    const sortedResults = [...this.results].sort((a, b) => b["Total Marks"] - a["Total Marks"]);
  
    for (let i = 0; i < totalStudents; i++) {
      const student = sortedResults[i];
  
      if (student["Total Marks"] !== previousTotalMarks) {
        // Update the rank only if the total marks are different
        currentRank = i + 1;
        currentPercentageRank = i + 1;
      }
  
      const resultIndex = this.results.findIndex((result) => result["RollNo"] === student["RollNo"]);
      if (resultIndex !== -1) {
        const result = this.results[resultIndex];
  
        // Calculate and store the rank and percentage in separate variables
        const rank = currentRank;
  
        let percentage;
        if (result["Total Marks"] < 0) {
          percentage = 0;
        } else {
          percentage = (result["Total Marks"] / this.maximumTotalMarks) * 100;
          totalPercentage += percentage;
          lowestPercentage = Math.min(lowestPercentage, percentage);
          highestPercentage = Math.max(highestPercentage, percentage);
        }
  
        // Update the result object with the calculated values
        result["Rank"] = rank;
        result["Percentage"] = percentage;
      }
  
      previousTotalMarks = student["Total Marks"];
    }
  
    const averagePercentage = totalPercentage / totalStudents;
    this.percentagesValues = {
      lowestPercentage: lowestPercentage,
      highestPercentage: highestPercentage,
      averagePercentage: averagePercentage
    };
  
    // console.log("Lowest Percentage:", lowestPercentage);
    // console.log("Highest Percentage:", highestPercentage);
    // console.log("Average Percentage:", averagePercentage);
  }
  
  calculatePeerAverageCount() {
    const peerAverageCounts: any = {}; // Object to store the peer average counts
  
    // Iterate over all students' results
    for (const student of this.results) {
      // Iterate over each subject in the student's result
      for (const key in student) {
        if (key.startsWith("Subject") && key.endsWith("Right Count")) {
          const subjectName = key.split(" ")[1]; // Extract subject name from the key
          const rightCountKey = `Subject ${subjectName} Peer Right Count`;
          const wrongCountKey = `Subject ${subjectName} Peer Wrong Count`;
          const blankCountKey = `Subject ${subjectName} Peer Blank Count`;
  
          if (!peerAverageCounts[rightCountKey]) {
            peerAverageCounts[rightCountKey] = 0;
          }
  
          if (!peerAverageCounts[wrongCountKey]) {
            peerAverageCounts[wrongCountKey] = 0;
          }
  
          if (!peerAverageCounts[blankCountKey]) {
            peerAverageCounts[blankCountKey] = 0;
          }
  
          peerAverageCounts[rightCountKey] += student[key] || 0; // Add the right count to the subject-wise total
          peerAverageCounts[wrongCountKey] += student[key.replace("Right", "Wrong")] || 0; // Add the wrong count to the subject-wise total
          peerAverageCounts[blankCountKey] += student[key.replace("Right", "Blank")] || 0; // Add the blank count to the subject-wise total
        }
      }
    }
  
    // Calculate the average counts
    for (const key in peerAverageCounts) {
      if (peerAverageCounts.hasOwnProperty(key)) {
        peerAverageCounts[key] /= this.results.length;
      }
    }
  
    // Store the calculated peer average counts in the instance variable
    this.peerAverageCounts = peerAverageCounts;
    // console.log("Peer Average Count:", this.peerAverageCounts);
  }
  
  calculateSubjectWiseMarks() {
    const subjectWiseMarks: any = {};
  
    // Iterate over all subjects in the answer key
    for (const answer of this.answer_key) {
      const subjectName = answer.Subject;
      const subjectKey = `Subject ${subjectName}`;
  
      // Calculate the peer lowest, average, and highest total marks for the subject
      let peerLowestTotalMarks = Infinity;
      let peerHighestTotalMarks = -Infinity;
      let peerTotalMarks = 0;
      let peerCount = 0;
  
      for (const student of this.results) {
        const totalMarks = student[`${subjectKey} Total Marks`] || 0;
  
        if (totalMarks < peerLowestTotalMarks) {
          peerLowestTotalMarks = totalMarks;
        }
  
        if (totalMarks > peerHighestTotalMarks) {
          peerHighestTotalMarks = totalMarks;
        }
  
        peerTotalMarks += totalMarks;
        peerCount++;
      }
  
      const peerAverageTotalMarks = peerTotalMarks / peerCount;
  
      // Store the subject-wise marks in the subjectWiseMarks object
      subjectWiseMarks[`${subjectKey} Peer Lowest Total Marks`] = peerLowestTotalMarks;
      subjectWiseMarks[`${subjectKey} Peer Average Total Marks`] = peerAverageTotalMarks;
      subjectWiseMarks[`${subjectKey} Peer Highest Total Marks`] = peerHighestTotalMarks;
    }
  
    // Store the calculated subject-wise marks in the instance variable
    this.subjectWiseMarks = subjectWiseMarks;
    // console.log("Subject-wise Marks:", this.subjectWiseMarks);
  }
  
  
  
  
  toppersList() {
    const sortedResults = [...this.results].sort((a, b) => b["Percentage"] - a["Percentage"]);
    this.topCandidates = [];
  
    for (let i = 0; i < 5 && i < sortedResults.length; i++) {
      const student = sortedResults[i];
      const rollNo = student["RollNo"];
      const matchedStudent = this.students_data.find((s: any) => s["RollNo"] == rollNo);
  
      if (matchedStudent) {
        const candidateData: any = {
          Rank: student["Rank"],
          RollNo: rollNo,
          Percentage: student["Percentage"],
          TotalMarks: student["Total Marks"],
          Name: matchedStudent["Student Name"]
        };
  
        // Iterate over the student object to dynamically add subject-wise marks
        for (const key in student) {
          if (key.startsWith("Subject") && key.endsWith("Total Marks")) {
            const subjectName = key.substring(8, key.indexOf(" Total Marks"));
            const subjectTotalMarks = student[key];
            const subjectField = `Subject ${subjectName} Total Marks`;
            candidateData[subjectField] = subjectTotalMarks;
          }
        }
  
        this.topCandidates.push(candidateData);
      }
    }
  
    // console.log("Top Candidates Object:", this.topCandidates);
  }
  
  
  

  exportToPdf(): void {
    const totalHeaders = this.headers.length;
    const orientation = totalHeaders <= 7 ? 'portrait' : 'landscape';
  
    const doc = new jsPDF({
      orientation: orientation,
      unit: 'pt',
      format: [792, 612],
    });
  
    const tableData = [];
    const headerRow = [];
  
    for (const header of this.headers) {
      headerRow.push(header);
    }
  
    tableData.push(headerRow);
  
    for (const element of this.dataSource.filteredData) {
      const dataRow = [];
      for (const header of this.headers) {
        dataRow.push(element[header]);
      }
      tableData.push(dataRow);
    }
  
    const tableConfig:any = {
      head: tableData.slice(0, 1),
      body: tableData.slice(1),
      styles: {
        fontSize: totalHeaders > 10 ? 10 : 12,
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      columnStyles: {},
    };
  
    if (totalHeaders > 7) {
      tableConfig.styles.cellPadding = 2;
      tableConfig.columnStyles = {
        ...tableConfig.columnStyles,
        // Adjust the cell width for each column as needed
        // You can set a fixed width or calculate it dynamically based on content length
      };
    }
  
    autoTable(doc, tableConfig);
  
    doc.save('table_data.pdf');
  }
  
  
  

  exportToCsv(): void {
    const csvRows = [];

    // Header row
    const headerRow = this.headers.join(',');
    csvRows.push(headerRow);

    // Data rows
    for (const element of this.dataSource.filteredData) {
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






  calculateMaximumTotalMarks() {
    this.maximumTotalMarks = this.answer_key.reduce((totalMarks: number, question: any) => {
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
    // console.log('Clicked row:', row);

    // Find the result for the clicked roll number
    const clickedRollNo = row["RollNo"]; // Convert the roll number to a number
    const rollNoResult = this.results.find(result => result["RollNo"] == parseInt(clickedRollNo));

    console.log("rollNoResult",rollNoResult);

    //student data
    // const studentData = this.students_data.find((student: { [x: string]: number; }) => student["RollNo"] == clickedRollNo);

       // Filter out headers starting with "Q" followed by a numerical value for the specific roll number
const filteredData = this.omr_response
.filter((dataObj : any) => dataObj["RollNo"] == clickedRollNo) // Filter based on roll number
.map((dataObj: { [x: string]: any; }) => {
  const filteredObj: any = {};
  for (const key in dataObj) {
    if (key.startsWith("Q") && /\d/.test(key)) {
      filteredObj[key] = dataObj[key];
    }
  }

  console.log(filteredObj);
  return filteredObj;
});

    if (rollNoResult){
      // Result found
      // console.log("Result:", rollNoResult);
      // console.log("Student Data : ", studentData);
      const studentReportData: any = {
        resultData: rollNoResult,
        // studentPersonalInfo: studentData,
        percentagesValue: this.percentagesValues,
        peerAverageCounts: this.peerAverageCounts,
        subjectWiseMarks : this.subjectWiseMarks,
        answer_key : this.answer_key,
        // toppersList : this.topCandidates,
        questionWiseRWB : this.resultObject,
        omrResponse : filteredData[0]
      }
      this.dataService.setClickedRow(studentReportData);
      this.router.navigate(['/student-personal-report']);
    } else {
      // Result not found
      alert("Report Not Found. Make sure you have selected Student's RollNo. !")
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


  //for filtering
  onHeaderClick(header : any){
    // console.log("header : ", header);
    const headerValues = this.dataSource.data.map((element:any) => element[header]);

  const requiredData = {
    header: headerValues,
    dataSource:this.dataSource
  }
  
  // console.log(requiredData);
  }


  

  openHeaderDialog(header: string): void {

    const data = {
      header: header,
      headerValues: this.dataSource.filteredData.map((element:any) => element[header]),
      dataSource: this.dataSource
    };

    // if values are same , then show once !
    
    const uniqueHeaderValues = [...new Set(data.headerValues)];
    const headerValues = uniqueHeaderValues.filter((value, index, array) => array.indexOf(value) === index);
    
    data.headerValues = headerValues;
    

    const dialogRef = this.dialog.open(HeaderDialogComponent, {
      data: data
    });
  
    dialogRef.afterClosed().subscribe(newDataSource => {
      if (newDataSource) {
        // console.log("newDataSource: ", newDataSource);
        this.dataSource = new MatTableDataSource(newDataSource.newDataSource);
        // Perform any further actions with the selected values

        // console.log("DATA SOURCE ",this.dataSource );
      }
    });
  }
  

  clearAllFilters(){
    //recover dataSource data as it was earlier

    this.dataSource = this.tempDataSource;
    // console.log("DATA SOURCE : ", this.dataSource);
  }
  

}
