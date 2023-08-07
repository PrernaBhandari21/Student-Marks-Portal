import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { SelectPaperWiseHeadersComponent } from '../select-paper-wise-headers/select-paper-wise-headers.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-paper-wise-result-calculation',
  templateUrl: './paper-wise-result-calculation.component.html',
  styleUrls: ['./paper-wise-result-calculation.component.css']
})
export class PaperWiseResultCalculationComponent implements OnInit {
  sortDirection: { [key: string]: boolean } = {};
  reportName: any = '';
  studentsWithResults: any[] = []; // Array to hold students with their results
  studentsData: any;
  answerKeyForPaperA: any;
  studentRespForPaperA: any;
  answerKeyForPaperB: any;
  studentRespForPaperB: any;
  resultPaperA: any[] = [];
  resultPaperB: any[] = [];
  maximumTotalMarks: any;
  percentagesValues: any;
  combinedResult: any[] = [];

  constructor(private dataService: DataService,
    private dialog : MatDialog) {}

  async ngOnInit() {
    await this.getPaperWiseData();
    if(this.answerKeyForPaperA.length){
     this.calcuateResultOfPaperA(this.answerKeyForPaperA, this.studentRespForPaperA);
    }

    if(this.answerKeyForPaperB.length){
    this.calcuateResultOfPaperB(this.answerKeyForPaperB, this.studentRespForPaperB);
    }
   
    this.generateCombinedResult();
    

  }

  generateCombinedResult(){
    const combinedArray = [...this.resultPaperA, ...this.resultPaperB];
    // this.combinedResult =[...this.resultPaperA, ...this.resultPaperB];
    console.log("combinedArray is ====> ",combinedArray);


    // Group results by RollNo
  const groupedResults = combinedArray.reduce((acc, curr) => {
    const rollNo = curr.RollNo;
    if (!acc[rollNo]) {
      acc[rollNo] = [];
    }
    acc[rollNo].push(curr);
    return acc;
  }, {});

  // Calculate total marks for each RollNo
  for (const rollNo in groupedResults) {
    const results = groupedResults[rollNo];
    const totalMarksObtained = results.reduce((sum: any, result: any) => sum + result['Total Marks Obtained'], 0);
    const totalMarks = results.reduce((sum : any, result : any) => sum + result['Total Marks'], 0);
    const totalRightCount = results.reduce((sum : any, result : any) => sum + result['Total Right Count'], 0);
    const totalWrongCount = results.reduce((sum : any, result : any) => sum + result['Total Wrong Count'], 0);
    const totalBlankCount = results.reduce((sum : any, result : any) => sum + result['Total Blank Count'], 0);
    const totalRightMarks = results.reduce((sum : any, result : any) => sum + result['Total Right Marks'], 0);
    const totalWrongMarks = results.reduce((sum : any, result : any) => sum + result['Total Wrong Marks'], 0);



    this.combinedResult.push({
      RollNo: parseInt(rollNo),
      'Total Marks Obtained': totalMarksObtained,
      'Total Marks': totalMarks,
      'Total Right Count':totalRightCount ,
      'Total Wrong Count': totalWrongCount,
      'Total Blank Count' :totalBlankCount,
      'Total Right Marks':totalRightMarks ,
      'Total Wrong Marks' :totalWrongMarks 
    });
  }

  console.log("combinedResult is ====> ", this.combinedResult);

  this.calculateOverallRankAndPercentage();
  return this.combinedResult;
  }

  async getPaperWiseData() {
    const reportData = await this.dataService.getReportData();
    this.studentsData = reportData['studentDetails'];
    this.answerKeyForPaperA = reportData['answerKeyFileForPaperA'];
    this.studentRespForPaperA = reportData['studentResponsesFileForPaperA'];
    this.answerKeyForPaperB = reportData['answerKeyFileForPaperB'];
    this.studentRespForPaperB = reportData['studentResponsesFileForPaperB'];


  }

  calcuateResultOfPaperA(answerKey: any[], studentResponses: any[]) {
   

    for (let i = 0; i < studentResponses.length; i++) {
      let obj: any = {};
      let total_marks = 0;
      let total_right_marks = 0;
      let total_wrong_marks = 0;
      let total_right_count = 0;
      let total_wrong_count = 0;
      let total_blank_count = 0;

      // Calculate the TotalOutOf marks for all questions
      let totalOutOfMarks = 0;
      for (let question of answerKey) {
        totalOutOfMarks += question.FullMarks;
      }

      // Adding RollNo in results array
      obj["RollNo"] = studentResponses[i]["RollNo"];
      for (let j = 0; j < answerKey.length; j++) {
        let question = "Question" + (j + 1);
        let answer = studentResponses[i][question];
        let correct_answer = answerKey[j].Key;
        let full_marks =  answerKey[j].FullMarks;
        let partial_marks = answerKey[j]["Partial Marks"];
        let negative_marks = answerKey[j]["Negative Marks"];

        // Adding values for headers like Q1, Q2....so on
        if (answer == correct_answer) {
         
          obj[question] = full_marks;
          total_marks += full_marks;
          total_right_marks += full_marks;
          total_right_count++;
        } 
        else if (answer) {
          obj[question] = negative_marks;
          total_marks += negative_marks;
          total_wrong_marks += negative_marks;
          total_wrong_count++;
        } else {
          obj[question] = 0;
          total_blank_count++;
        }
      }

     // Adding total marks obtained and total marks to the object
    obj['Total Marks Obtained'] = total_marks; // total marks obtained by the student
    obj['Total Marks'] = totalOutOfMarks; // Calculate totalMarks (Out of marks)

    // Adding total_right_marks and total_wrong_marks to the object
    obj['Total Right Marks'] = total_right_marks;
    obj['Total Wrong Marks'] = total_wrong_marks;

    // Adding total_right_count, total_wrong_count, and total_blank_count to the object
    obj['Total Right Count'] = total_right_count;
    obj['Total Wrong Count'] = total_wrong_count;
    obj['Total Blank Count'] = total_blank_count;


    
      this.resultPaperA[i] = obj;
    }

    this.calculateRankAndPercentageForPaperA(answerKey);
  }

  calcuateResultOfPaperB(answerKey: any[], studentResponses: any[]) {
   
    for (let i = 0; i < studentResponses.length; i++) {
      let obj: any = {};
      let total_marks = 0;
      let total_right_marks = 0;
      let total_wrong_marks = 0;
      let total_right_count = 0;
      let total_wrong_count = 0;
      let total_blank_count = 0;

      // Calculate the TotalOutOf marks for all questions
      let totalOutOfMarks = 0;
      for (let question of answerKey) {
        totalOutOfMarks += question.FullMarks;
      }

      // Adding RollNo in results array
      obj["RollNo"] = studentResponses[i]["RollNo"];
      for (let j = 0; j < answerKey.length; j++) {
        let question = "Question" + (j + 1);
        let answer = studentResponses[i][question];
        let correct_answer = answerKey[j].Key;
        let full_marks =  answerKey[j].FullMarks;
        let partial_marks = answerKey[j]["Partial Marks"];
        let negative_marks = answerKey[j]["Negative Marks"];

        // Adding values for headers like Q1, Q2....so on
        if (answer == correct_answer) {
          obj[question] = full_marks;
          total_marks += full_marks;
          total_right_marks += full_marks;
          total_right_count++;
        } 
        else if (answer) {
          obj[question] = negative_marks;
          total_marks += negative_marks;
          total_wrong_marks += negative_marks;
          total_wrong_count++;
        } else {
          obj[question] = 0;
          total_blank_count++;
        }
      }

     // Adding total marks obtained and total marks to the object
    obj['Total Marks Obtained'] = total_marks; // total marks obtained by the student
    obj['Total Marks'] = totalOutOfMarks; // Calculate totalMarks (Out of marks)

    // Adding total_right_marks and total_wrong_marks to the object
    obj['Total Right Marks'] = total_right_marks;
    obj['Total Wrong Marks'] = total_wrong_marks;

    // Adding total_right_count, total_wrong_count, and total_blank_count to the object
    obj['Total Right Count'] = total_right_count;
    obj['Total Wrong Count'] = total_wrong_count;
    obj['Total Blank Count'] = total_blank_count;


    
      this.resultPaperB[i] = obj;
    }

    this.calculateRankAndPercentageForPaperB(answerKey);
  }

  calculateRankAndPercentageForPaperA(answerKey: any[]) {
    // Calculate the rank and percentage for each student
    const totalStudents = this.resultPaperA.length;
    let totalPercentage = 0;
    let lowestPercentage = Infinity;
    let highestPercentage = -Infinity;

    let previousTotalMarks = null;
    let currentRank = 0;

    // Sort the students based on total marks obtained temporarily
    const sortedResults = [...this.resultPaperA].sort((a, b) => b["Total Marks Obtained"] - a["Total Marks Obtained"]);

    for (let i = 0; i < totalStudents; i++) {
      const student = sortedResults[i];

      if (student["Total Marks Obtained"] !== previousTotalMarks) {
        // Update the rank only if the total marks obtained are different
        currentRank = i + 1;
      }

      const resultIndex = this.resultPaperA.findIndex((result) => result["RollNo"] === student["RollNo"]);
      if (resultIndex !== -1) {
        const result = this.resultPaperA[resultIndex];

        // Calculate and store the rank and percentage in separate variables
        const rank = currentRank;

        let percentage;
        if (result["Total Marks Obtained"] < 0) {
          percentage = 0;
        } else {
          percentage = (result["Total Marks Obtained"] / this.calculateMaximumTotalMarks(answerKey)) * 100;
          totalPercentage += percentage;
          lowestPercentage = Math.min(lowestPercentage, percentage);
          highestPercentage = Math.max(highestPercentage, percentage);
        }

        // Update the result object with the calculated values
        result["Rank"] = rank;
        result["Percentage"] = percentage;
      }

      previousTotalMarks = student["Total Marks Obtained"];
    }

    const averagePercentage = totalPercentage / totalStudents;
    this.percentagesValues = {
      lowestPercentage: lowestPercentage,
      highestPercentage: highestPercentage,
      averagePercentage: averagePercentage,
    };

    
  }


  calculateRankAndPercentageForPaperB(answerKey: any[]) {
    // Calculate the rank and percentage for each student
    const totalStudents = this.resultPaperB.length;
    let totalPercentage = 0;
    let lowestPercentage = Infinity;
    let highestPercentage = -Infinity;

    let previousTotalMarks = null;
    let currentRank = 0;

    // Sort the students based on total marks obtained temporarily
    const sortedResults = [...this.resultPaperB].sort((a, b) => b["Total Marks Obtained"] - a["Total Marks Obtained"]);

    for (let i = 0; i < totalStudents; i++) {
      const student = sortedResults[i];

      if (student["Total Marks Obtained"] !== previousTotalMarks) {
        // Update the rank only if the total marks obtained are different
        currentRank = i + 1;
      }

      const resultIndex = this.resultPaperB.findIndex((result) => result["RollNo"] === student["RollNo"]);
      if (resultIndex !== -1) {
        const result = this.resultPaperB[resultIndex];

        // Calculate and store the rank and percentage in separate variables
        const rank = currentRank;

        let percentage;
        if (result["Total Marks Obtained"] < 0) {
          percentage = 0;
        } else {
          percentage = (result["Total Marks Obtained"] / this.calculateMaximumTotalMarks(answerKey)) * 100;
          totalPercentage += percentage;
          lowestPercentage = Math.min(lowestPercentage, percentage);
          highestPercentage = Math.max(highestPercentage, percentage);
        }

        // Update the result object with the calculated values
        result["Rank"] = rank;
        result["Percentage"] = percentage;
      }

      previousTotalMarks = student["Total Marks Obtained"];
    }

    const averagePercentage = totalPercentage / totalStudents;
    this.percentagesValues = {
      lowestPercentage: lowestPercentage,
      highestPercentage: highestPercentage,
      averagePercentage: averagePercentage,
    };

    
  }

  calculateOverallRankAndPercentage() {
    const totalStudents = this.combinedResult.length;
    let totalPercentage = 0;
    let lowestPercentage = Infinity;
    let highestPercentage = -Infinity;
  
    let previousTotalMarks = null;
    let currentRank = 0;
  
    // Sort the students based on total marks obtained temporarily
    const sortedResults = [...this.combinedResult].sort((a, b) => b["Total Marks Obtained"] - a["Total Marks Obtained"]);
  
    for (let i = 0; i < totalStudents; i++) {
      const student = sortedResults[i];
  
      if (student["Total Marks Obtained"] !== previousTotalMarks) {
        // Update the rank only if the total marks obtained are different
        currentRank = i + 1;
      }
  
      // Calculate and store the rank and percentage in separate variables
      const rank = currentRank;
      let percentage = (student["Total Marks Obtained"] / student["Total Marks"]) * 100;
      percentage = Math.max(percentage, 0); // Make sure percentage is at least 0
      totalPercentage += percentage;
      lowestPercentage = Math.min(lowestPercentage, percentage);
      highestPercentage = Math.max(highestPercentage, percentage);
  
      // Update the result object with the calculated values
      student["Rank"] = rank;
      student["Percentage"] = percentage;
  
      previousTotalMarks = student["Total Marks Obtained"];
    }
  
    const averagePercentage = totalPercentage / totalStudents;
    this.percentagesValues = {
      lowestPercentage: lowestPercentage,
      highestPercentage: highestPercentage,
      averagePercentage: averagePercentage,
    };
  }
  

  calculateMaximumTotalMarks(answerKey: any[]) {
    return answerKey.reduce((totalMarks: number, question: any) => {
   
      return totalMarks + question["FullMarks"];
    }, 0);
  }

  openPopup(): void {

    const dialogRef = this.dialog.open(SelectPaperWiseHeadersComponent, {
      width: '60%',

      data: {
     
        studentsData: this.studentsData,
        studentsDataHeaders: Object.keys(this.studentsData[0]),
        combinedResult : this.combinedResult,
        combinedResultHeaders : Object.keys(this.combinedResult[0])
      }
    });

   




  }
}
