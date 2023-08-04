import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

interface Student {
  RollNo: number;
  // Add other properties for Student data here...
}

interface QuestionPaper {
  Key: string;
  SubjectName: string;
  // Add other properties for Question Paper data here...
}

interface DataPaper {
  RollNo: number;
  Question: string;
  TotalMarks: number;
  Percentage: number;
  // Add other properties for Data Paper data here...
}

interface SubjectMaster {
  SubjectName: string;
  Topics: string;
  // Add other properties for Subject Master data here...
}

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
  combinedResults:any[]=[];  


  constructor(private dataService: DataService) {}

  async ngOnInit() {
    await this.getPaperWiseData();
    if(this.answerKeyForPaperA.length){
     this.calcuateResultOfPaperA(this.answerKeyForPaperA, this.studentRespForPaperA);
    }

    if(this.answerKeyForPaperB.length){
    this.calcuateResultOfPaperB(this.answerKeyForPaperB, this.studentRespForPaperB);
    }
     // Merge the results of Paper A and Paper B into combinedResults
  this.combinedResults = [...this.resultPaperA, ...this.resultPaperB];
  console.log("Combined result is",this.combinedResults);

  }

  async getPaperWiseData() {
    const reportData = await this.dataService.getReportData();
    this.studentsData = reportData['studentDetails'];
    this.answerKeyForPaperA = reportData['answerKeyFileForPaperA'];
    this.studentRespForPaperA = reportData['studentResponsesFileForPaperA'];
    this.answerKeyForPaperB = reportData['answerKeyFileForPaperB'];
    this.studentRespForPaperB = reportData['studentResponsesFileForPaperB'];

    console.log("Data received for generating result ----------");
    console.log("this.studentsData :", this.studentsData);
    console.log("this.answerKeyForPaperA : ", this.answerKeyForPaperA);
    console.log("this.studentRespForPaperA : ", this.studentRespForPaperA);
    console.log("this.answerKeyForPaperB : ", this.answerKeyForPaperB);
    console.log("this.studentRespForPaperB : ", this.studentRespForPaperB);
  }

  calcuateResultOfPaperA(answerKey: any[], studentResponses: any[]) {
    console.log("calculating for answerKey : ", answerKey);
    console.log("calculating for studentResponses : ", studentResponses);

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
          console.log("Correct_Answer")
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
      console.log("Done for 1 student : , ",  obj);
    }

    this.calculateRankAndPercentageForPaperA(answerKey);
  }

  calcuateResultOfPaperB(answerKey: any[], studentResponses: any[]) {
    console.log("calculating for answerKey : ", answerKey);
    console.log("calculating for studentResponses : ", studentResponses);

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
          console.log("Correct_Answer")
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
      console.log("Done for 1 student : , ",  obj);
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
        console.log("Rank is", rank);
        result["Percentage"] = percentage;
        console.log("Percentage is", percentage);
      }

      previousTotalMarks = student["Total Marks Obtained"];
    }

    const averagePercentage = totalPercentage / totalStudents;
    this.percentagesValues = {
      lowestPercentage: lowestPercentage,
      highestPercentage: highestPercentage,
      averagePercentage: averagePercentage,
    };

    console.log("Lowest Percentage:", lowestPercentage);
    console.log("Highest Percentage:", highestPercentage);
    console.log("Average Percentage:", averagePercentage);
    console.log("FINAL RESULT   FOR PAPER A....................... : ", this.resultPaperA);
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
        console.log("Rank is", rank);
        result["Percentage"] = percentage;
        console.log("Percentage is", percentage);
      }

      previousTotalMarks = student["Total Marks Obtained"];
    }

    const averagePercentage = totalPercentage / totalStudents;
    this.percentagesValues = {
      lowestPercentage: lowestPercentage,
      highestPercentage: highestPercentage,
      averagePercentage: averagePercentage,
    };

    console.log("Lowest Percentage:", lowestPercentage);
    console.log("Highest Percentage:", highestPercentage);
    console.log("Average Percentage:", averagePercentage);
    console.log("FINAL RESULT   FOR PAPER B....................... : ", this.resultPaperB);
  }

  calculateMaximumTotalMarks(answerKey: any[]) {
    return answerKey.reduce((totalMarks: number, question: any) => {
      console.log('question["FullMarks"] : ', question["FullMarks"]);
      return totalMarks + question["FullMarks"];
    }, 0);
  }
}
