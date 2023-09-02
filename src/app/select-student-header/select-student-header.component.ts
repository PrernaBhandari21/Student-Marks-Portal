import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-student-header',
  templateUrl: './select-student-header.component.html',
  styleUrls: ['./select-student-header.component.css']
})
export class SelectStudentHeaderComponent implements OnInit {

  form: FormGroup;
  selectedHeaders: string[] = [];
  resultant: { [header: string]: any[] } = {};
  studentDataResultant: { [header: string]: any[] } = {};
  omrDataResultant: { [header: string]: any[] } = {};
  fieldsDataResultant: { [header: string]: any[] } = {};

  
  constructor(public dialogRef: MatDialogRef<SelectStudentHeaderComponent>,
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
    this.data.omrResponseHeaders.forEach((header: any) => {
      this.form.addControl(header, new FormControl(false));
    });
  }

  ngOnInit(): void {
    console.log("data received : ", this.data);
  }



  onStudentCheckboxChange(header: string, isChecked: boolean): void {
    if (isChecked) {
      const headerData = this.data.studentsData.map((student: any) => student[header]);
      this.studentDataResultant[header] = headerData;
    } else {
      delete this.studentDataResultant[header];
    }
  }

  onOMRCheckboxChange(header: string, isChecked: boolean): void {
    console.log("header", header);
    console.log(" this.data.omrResponseData.map((omr: any) => omr[header])", this.data.omrResponseData.map((omr: any) => omr[header]));
    if (isChecked) {
      const headerData = this.data.omrResponseData.map((omr: any) => omr[header]);
      this.omrDataResultant[header] = headerData;
    } else {
      delete this.omrDataResultant[header];
    }
  }

  onFieldsRadioButtonChange(header: string): void {
    console.log("header", header);
    let common_data: any;

    this.fieldsDataResultant = {};

    if (header === 'Subject Wise Marks') {
      console.log("Object.values(this.data.resultData)", Object.values(this.data.resultDataHeaders));
      const subjectTotalHeaders = Object.values(this.data.resultDataHeaders)
        .filter((header: any) => header.includes('Subject') && header.includes('Total'));
      console.log("subjectTotalHeaders", subjectTotalHeaders);

      // Do something with the fetched headers
      for (let i = 0; i < subjectTotalHeaders.length; i++) {
        let headerVal: any = subjectTotalHeaders[i]
        console.log("headerVal", headerVal);
        const headerData = this.data.resultData.map((omr: any) => omr[headerVal]);
        console.log("headerData", headerData);
        this.fieldsDataResultant[headerVal] = headerData;
      }
      this.totalMarksCommonData();

      console.log("this.fieldsDataResultant....................", this.fieldsDataResultant);
    } else if (header === 'Subject Wise Right Wrong Blank Count') {
      console.log("Object.values(this.data.resultData)", Object.values(this.data.resultDataHeaders));
      const subjectTotalHeaders = Object.values(this.data.resultDataHeaders)
        .filter((header: any) => header.includes('Subject') && ((header.includes('Right Count') || header.includes('Wrong Count')) || header.includes('Blank Count') || header.includes('Total')));
      console.log("subjectTotalHeaders", subjectTotalHeaders);

      // Do something with the fetched headers
      for (let i = 0; i < subjectTotalHeaders.length; i++) {
        let headerVal: any = subjectTotalHeaders[i]
        console.log("headerVal", headerVal);
        const headerData = this.data.resultData.map((omr: any) => omr[headerVal]);
        console.log("headerData", headerData);
        this.fieldsDataResultant[headerVal] = headerData;
      }

      this.totalRWBCount();

      this.totalMarksCommonData();

      console.log("this.fieldsDataResultant....................", this.fieldsDataResultant);
    } else if (header === 'Right Wrong Blank Count') {
      this.totalRWBCount();
      this.totalMarksCommonData();
      console.log("Now fieldsDataResultant", this.fieldsDataResultant);
    } else if (header == 'Total Marks') {
      this.totalMarksCommonData();
    }
    console.log("this.fieldsDataResultant", this.fieldsDataResultant);


  }


  totalMarksCommonData() {
    const obtainedMarksHeader = "Total Marks Obtained"
    const totalMarksHeader = "Total Marks";
    const rank = "Rank";
    const percentage = "Percentage"

    const obtainedMarks = this.data.resultData.map((omr: any) => omr[obtainedMarksHeader]);
    const totalMarks = this.data.resultData.map((omr: any) => omr[totalMarksHeader]);
    const allRank = this.data.resultData.map((omr: any) => omr[rank]);
    const allPercentage = this.data.resultData.map((omr: any) => omr[percentage]);


    this.fieldsDataResultant[obtainedMarksHeader] = obtainedMarks;
    this.fieldsDataResultant[totalMarksHeader] = totalMarks;
    this.fieldsDataResultant[rank] = allRank
    this.fieldsDataResultant[percentage] = allPercentage
  }


  totalRWBCount() {
    const totalRightHeader = "Total Right Count";
    const totalWrongHeader = "Total Wrong Count";
    const totalBlankHeader = "Total Blank Count";

    const totalRightCount = this.data.resultData.map((omr: any) => omr[totalRightHeader]);
    const totalWrongCount = this.data.resultData.map((omr: any) => omr[totalWrongHeader]);
    const totalBlankCount = this.data.resultData.map((omr: any) => omr[totalBlankHeader]);

    this.fieldsDataResultant[totalRightHeader] = totalRightCount;
    this.fieldsDataResultant[totalWrongHeader] = totalWrongCount;
    this.fieldsDataResultant[totalBlankHeader] = totalBlankCount;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // this.resultant =

    console.log("omrDataResultant", this.omrDataResultant);
    console.log("studentDataResultant", this.studentDataResultant);

    // Merge multiple objects
    this.resultant = Object.assign({}, this.omrDataResultant, this.studentDataResultant, this.fieldsDataResultant);

    console.log("this.resultant", this.resultant);

    // Perform further actions with the resultant data
    this.dialogRef.close(this.resultant);
  }

}

