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
  results: any[] = [];
  resultsB: any[] = [];
  maximumTotalMarks: any;
  percentagesValues: any;

  constructor(private dataService: DataService) {}

  async ngOnInit() {
    await this.getPaperWiseData();
    this.calcuateResultOfPaper(this.answerKeyForPaperA, this.studentRespForPaperA);
    this.calcuateResultOfPaper(this.answerKeyForPaperB, this.studentRespForPaperB);
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

  calcuateResultOfPaper(answerKey: any[], studentResponses: any[]) {
    for (let i = 0; i < studentResponses.length; i++) {
      let obj: any = {};
      let total_marks = 0;

      // Calculate the TotalOutOf marks for all questions
      let totalOutOfMarks = 0;
      for (let question of answerKey) {
        totalOutOfMarks += question.FullMarks;
      }

      // Adding RollNo in results array
      obj["RollNo"] = studentResponses[i]["RollNo"];

      console.log("obj['RollNo']", obj["RollNo"]);
      console.log('studentResponses[i]["RollNo"]', studentResponses[i]["RollNo"]);

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
        } 
        else if (answer) {
          obj[question] = negative_marks;
          total_marks += negative_marks;
        } else {
          obj[question] = 0;
        }
      }

      // Adding total marks obtained and total marks to the object
      obj['Total Marks Obtained'] = total_marks; // total marks obtained by the student
      obj['Total Marks'] = totalOutOfMarks; // Calculate totalMarks (Out of marks)

      console.log("i =>",i);
      this.results[i] = obj;
      console.log(" obj , ",  obj);
    }

    this.calculateRankAndPercentage(answerKey);
  }

  calculateRankAndPercentage(answerKey: any[]) {
    // Calculate the rank and percentage for each student
    const totalStudents = this.results.length;
    let totalPercentage = 0;
    let lowestPercentage = Infinity;
    let highestPercentage = -Infinity;

    let previousTotalMarks = null;
    let currentRank = 0;

    // Sort the students based on total marks obtained temporarily
    const sortedResults = [...this.results].sort((a, b) => b["Total Marks Obtained"] - a["Total Marks Obtained"]);

    for (let i = 0; i < totalStudents; i++) {
      const student = sortedResults[i];

      if (student["Total Marks Obtained"] !== previousTotalMarks) {
        // Update the rank only if the total marks obtained are different
        currentRank = i + 1;
      }

      const resultIndex = this.results.findIndex((result) => result["RollNo"] === student["RollNo"]);
      if (resultIndex !== -1) {
        const result = this.results[resultIndex];

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
  }

  calculateMaximumTotalMarks(answerKey: any[]) {
    return answerKey.reduce((totalMarks: number, question: any) => {
      console.log('question["FullMarks"] : ', question["FullMarks"]);
      return totalMarks + question["FullMarks"];
    }, 0);
  }
}
