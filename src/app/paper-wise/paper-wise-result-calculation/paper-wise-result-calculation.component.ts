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

  constructor(private dataService: DataService) {}

  async ngOnInit() {
    await this.getPaperWiseData();
  }

  async getPaperWiseData() {
    const reportData = await this.dataService.getReportData();
    this.studentsData= reportData['studentDetails'];
    this.answerKeyForPaperA = reportData['answerKeyFileForPaperA'];
    this.studentRespForPaperA = reportData['studentResponsesFileForPaperA'];
    
    
    console.log("Data received for generating reult ----------");
    console.log("this.studentsData :", this.studentsData);
    console.log("this.answerKeyForPaperA : ",this.answerKeyForPaperA);
    console.log("this.studentRespForPaperA : ", this.studentRespForPaperA);

  
  
  
  }
  
}
