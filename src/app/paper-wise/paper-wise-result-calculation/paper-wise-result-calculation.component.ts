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

  constructor(private dataService: DataService) {}

  async ngOnInit() {
    await this.getPaperWiseData();
  }

  async getPaperWiseData() {
    const reportData = await this.dataService.reportData();
    const studentsData: Student[] = reportData['Student Data'];
    const questionPaperData: QuestionPaper[] = reportData['Question Paper A'];
    const dataPaperData: DataPaper[] = reportData['Data Paper A for checking Answer'];
    const subjectMasterData: SubjectMaster[] = reportData['Subject Master'];
  
    // Processing logic to map student data with their results
    this.studentsWithResults = studentsData.map((student: Student) => {
      const resultData = dataPaperData.find((data: DataPaper) => data.RollNo === student.RollNo);
  
      // Check if resultData is defined before accessing its properties
      const subjectName = resultData?.Question ? questionPaperData.find((q: QuestionPaper) => q.Key === resultData.Question)?.SubjectName || '' : '';
      const topics = subjectMasterData.find((subject: SubjectMaster) => subject.SubjectName === subjectName)?.Topics || '';
      const totalMarks = resultData?.TotalMarks || 0;
      const percentage = resultData?.Percentage || 0;
  
      return {
        ...student,
        SubjectName: subjectName,
        Topics: topics,
        TotalMarks: totalMarks,
        Percentage: percentage
      };
    });
  
    console.log("Mapped Students with Results: ", this.studentsWithResults);
  }
  
}
