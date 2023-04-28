import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectHeadersComponent } from '../select-headers/select-headers.component';
import { MatTableDataSource } from '@angular/material/table';


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
  tableResultant : any;
  tableHeaders: string[] = [];
  headers: string[] = [];
  columnHeaders: string[] =[];
  displayedColumns!: string[];
  dataSource:any;

  



  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    console.log("omr_response ", this.omr_response);
    console.log("answer_key", this.answer_key);
    console.log("students_data",this.students_data);

    this.calcuateResult();
  }

  

  // calcuateResult(){
  //   for(let i = 0; i< this.omr_response.length;i++){
  //     console.log(this.omr_response[i]["Roll No"]);
  //     let obj : any= { };

  //     //Adding Roll No in results array
  //     obj["Roll No"] = this.omr_response[i]["Roll No"];


  //     for(let j = 0; j<this.answer_key.length ; j++){
  //       let question = "Q" + (j+1);
  //     let answer = this.omr_response[i][question];
  //     let correct_answer = this.answer_key[j].AnswerKey;
  //     let full_marks = this.answer_key[j].FullMarks;
  //     let partial_marks = this.answer_key[j]["Partial Marks"];
  //     let negative_marks = this.answer_key[j]["Negative Marks"];
  //     let subject = this.answer_key[j].Subject;

  //     // Adding values for headers like Q1, Q2....so on
  //     if(answer == correct_answer) {
  //       obj[question] = full_marks;
  //     } else if(answer) {
  //       obj[question] = - negative_marks;
  //     } else {
  //       obj[question] = 0;
  //     }


  //       //Adding values for subjest wise



  //     }


  //     console.log("Ek bache ka hogya............ab next");
  //     this.results.push(obj)
  //   }







  //   console.log("FINAL>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.results);
  // }


  openPopup(): void {
    console.log("this.omr_response : ",this.omr_response);

// Filter out headers starting with "Q" followed by a numerical value
const filteredData = this.omr_response.map((dataObj: { [x: string]: any; }) => {
  const filteredObj:any = {};
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
        studentsDataHeaders: Object.keys(this.students_data[0])
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      this.tableResultant = result;

      console.log("this.tableResultant : ",this.tableResultant);

      
      this.headers = Object.keys(this.tableResultant);
      this.dataSource  = this.convertToDataSource();     
      
  


    });


    
    
  }

convertToDataSource() {
  const data = [];
  const properties = Object.keys(this.tableResultant);
  const randomProperty = properties[Math.floor(Math.random() * properties.length)];
  const length = this.tableResultant[randomProperty].length;

  for (let i = 0; i < length; i++) {
    const row :any = {};
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
  

 

  calcuateResult(){
    for(let i = 0; i < this.omr_response.length; i++){
      console.log(this.omr_response[i]["Roll No"]);
      let obj: any = {};
      let subject_wise_marks: any = {};
      let total_right_marks = 0;
      let total_wrong_marks = 0;
      let total_marks = 0;
  
      //Adding Roll No in results array
      obj["Roll No"] = this.omr_response[i]["Roll No"];
  
      for(let j = 0; j < this.answer_key.length; j++){
        let question = "Q" + (j+1);
        let answer = this.omr_response[i][question];
        let correct_answer = this.answer_key[j].AnswerKey;
        let full_marks = this.answer_key[j].FullMarks;
        let partial_marks = this.answer_key[j]["Partial Marks"];
        let negative_marks = this.answer_key[j]["Negative Marks"];
        let subject = this.answer_key[j].Subject;
  
        // Adding values for headers like Q1, Q2....so on
        if(answer == correct_answer) {
          obj[question] = full_marks;
          total_right_marks += full_marks;
          total_marks += full_marks;
        } else if(answer) {
          obj[question] = - negative_marks;
          total_wrong_marks -= negative_marks;
          total_marks -= negative_marks;
        } else {
          obj[question] = 0;
        }
  
        //Adding values for subject-wise headers
        if(subject){
          if(!subject_wise_marks[subject]){
            subject_wise_marks[subject] = {};
            subject_wise_marks[subject]['Right'] = 0;
            subject_wise_marks[subject]['Wrong'] = 0;
            subject_wise_marks[subject]['Blank'] = 0;
            subject_wise_marks[subject]['Total'] = 0;
          }
  
          if(answer == correct_answer) {
            subject_wise_marks[subject]['Right'] += full_marks;
          } else if(answer) {
            subject_wise_marks[subject]['Wrong'] -= negative_marks; 
          } else {
            subject_wise_marks[subject]['Blank'] += 1;
          }
  
          subject_wise_marks[subject]['Total'] = subject_wise_marks[subject]['Right'] + subject_wise_marks[subject]['Wrong'] + subject_wise_marks[subject]['Blank'];
        }
      }
  
      //Adding subject-wise marks to the object
      for(let subject in subject_wise_marks){
        obj['Subject ' + subject + ' Right'] = subject_wise_marks[subject]['Right'];
        obj['Subject ' + subject + ' Wrong'] = subject_wise_marks[subject]['Wrong'];
        obj['Subject ' + subject + ' Blank'] = subject_wise_marks[subject]['Blank'];
        obj['Subject ' + subject + ' Total Marks'] = subject_wise_marks[subject]['Total'];
      }
  
      //Adding total right, wrong, and marks to the object
      obj['Total Right Marks'] = total_right_marks;
      obj['Total Wrong Marks'] = total_wrong_marks;
      obj['Total Marks'] = total_marks;
  
      console.log("Ek bache ka hogya............ab next");
      this.results.push(obj);
    }
  
    console.log("FINAL>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.results);

    // this.download();

  }
  

  download() {
    const data = JSON.stringify(this.results);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  
  
  

}
