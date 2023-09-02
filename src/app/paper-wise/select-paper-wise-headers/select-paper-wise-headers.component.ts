import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-paper-wise-headers',
  templateUrl: './select-paper-wise-headers.component.html',
  styleUrls: ['./select-paper-wise-headers.component.css']
})
export class SelectPaperWiseHeadersComponent implements OnInit {
  form: FormGroup;
  selectedHeaders: string[] = [];
  studentDataResultant: { [header: string]: any[] } = {};
  resultant: { [header: string]: any[] } = {};
  fieldsDataResultant: { [header: string]: any[] } = {};

  constructor(public dialogRef: MatDialogRef<SelectPaperWiseHeadersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      selectedField: new FormControl('')
    });


    this.createFormControls();
  }

  createFormControls(): void {
    // this.data.studentsDataHeaders.forEach((header: any) => {
    //   this.form.addControl(header, new FormControl(false));
    // });
    this.data.combinedResultHeaders
    .forEach((header: any) => {
      this.form.addControl(header, new FormControl(false));
    });
  }


//  form!: FormGroup;

  
  ngOnInit(): void {
    console.log("Got Dataaaaaaaaaaaaaaa : ", this.data);
  }

  onStudentCheckboxChange(header: string, isChecked: boolean): void {
    if (isChecked) {
      const headerData = this.data.studentsData.map((student: any) => student[header]);
      console.log("headerData", headerData);
      this.studentDataResultant[header] = headerData;
      console.log("Nowwwwww this.studentDataResultant",this.studentDataResultant);
    } else {
      delete this.studentDataResultant[header];
    }
  }

  onFieldsRadioButtonChange(header: string): void {
    console.log("header", header);
    let common_data: any;

    this.fieldsDataResultant = {};
    if (header == 'Total Marks') {
      this.totalMarksCommonData();
    }
    console.log("this.fieldsDataResultant", this.fieldsDataResultant);


  }

  totalMarksCommonData() {
    const obtainedMarksHeader = "Total Marks Obtained"
    const totalMarksHeader = "Total Marks";
    const rank = "Rank";
    const percentage = "Percentage"

    const obtainedMarks = this.data.combinedResult.map((omr: any) => omr[obtainedMarksHeader]);
    const totalMarks = this.data.combinedResult.map((omr: any) => omr[totalMarksHeader]);
    const allRank = this.data.combinedResult.map((omr: any) => omr[rank]);
    const allPercentage = this.data.combinedResult.map((omr: any) => omr[percentage]);


    this.fieldsDataResultant[obtainedMarksHeader] = obtainedMarks;
    this.fieldsDataResultant[totalMarksHeader] = totalMarks;
    this.fieldsDataResultant[rank] = allRank
    this.fieldsDataResultant[percentage] = allPercentage
  }
  


  onSave(): void {
    // this.resultant =

    console.log("studentDataResultant", this.studentDataResultant);

    // Merge multiple objects
    this.resultant = Object.assign({}, this.studentDataResultant);

    console.log("this.resultant", this.resultant);

     // Perform further actions with the resultant data
     this.dialogRef.close(this.resultant);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
