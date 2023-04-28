import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-headers',
  templateUrl: './select-headers.component.html',
  styleUrls: ['./select-headers.component.css']
})
export class SelectHeadersComponent implements OnInit {
  form: FormGroup;
  selectedHeaders: string[] = [];
  resultant: { [header: string]: any[] } = {};
  studentDataResultant: { [header: string]: any[] } = {};
  omrDataResultant: { [header: string]: any[] } = {};
  fieldsDataResultant: { [header: string]: any[] } = {};



  constructor(public dialogRef: MatDialogRef<SelectHeadersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({});
    this.createFormControls();
  }

  createFormControls(): void {
    this.data.studentsDataHeaders.forEach((header: any) => {
      this.form.addControl(header, new FormControl(false));
    });
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

  onFieldsCheckboxChange(header: string, isChecked: boolean): void {
    console.log("header", header);



    if (header === 'Subject Wise Marks') {
      console.log("Object.values(this.data.resultData)", Object.values(this.data.resultDataHeaders));
      const subjectTotalHeaders = Object.values(this.data.resultDataHeaders)
        .filter((header: any) => header.includes('Subject') && header.includes('Total'));
      console.log("subjectTotalHeaders", subjectTotalHeaders);

      if (isChecked) {
        // Do something with the fetched headers
        for (let i = 0; i < subjectTotalHeaders.length; i++) {
          let headerVal: any = subjectTotalHeaders[i]
          console.log("headerVal", headerVal);
          const headerData = this.data.resultData.map((omr: any) => omr[headerVal]);
          console.log("headerData", headerData);
          this.fieldsDataResultant[headerVal] = headerData;

        }

      } else {
        // Handle other checkbox cases if needed

        for (let i = 0; i < subjectTotalHeaders.length; i++) {
          let headerVal: any = subjectTotalHeaders[i]
          console.log("headerVal", headerVal);
          delete this.fieldsDataResultant[headerVal];
        }
      }
      console.log("this.fieldsDataResultant....................", this.fieldsDataResultant);
    } else if(header === 'Subject Wise Right Wrong Marks'){
      console.log("Object.values(this.data.resultData)", Object.values(this.data.resultDataHeaders));
      const subjectTotalHeaders = Object.values(this.data.resultDataHeaders)
        .filter((header: any) => header.includes('Subject') && (header.includes('Right') || header.includes('Wrong')));
      console.log("subjectTotalHeaders", subjectTotalHeaders);

      if (isChecked) {
        // Do something with the fetched headers
        for (let i = 0; i < subjectTotalHeaders.length; i++) {
          let headerVal: any = subjectTotalHeaders[i]
          console.log("headerVal", headerVal);
          const headerData = this.data.resultData.map((omr: any) => omr[headerVal]);
          console.log("headerData", headerData);
          this.fieldsDataResultant[headerVal] = headerData;

        }

      } else {
        // Handle other checkbox cases if needed

        for (let i = 0; i < subjectTotalHeaders.length; i++) {
          let headerVal: any = subjectTotalHeaders[i]
          console.log("headerVal", headerVal);
          delete this.fieldsDataResultant[headerVal];
        }
      }
      console.log("this.fieldsDataResultant....................", this.fieldsDataResultant);
    } else if (header === 'Right Wrong Marks') {
      if (isChecked) {
        const totalRightHeader = "Total Right Marks";
        const totalWrongHeader = "Total Wrong Marks";
    
        const totalRightMarks = this.data.resultData.map((omr: any) => omr[totalRightHeader]);
        const totalWrongMarks = this.data.resultData.map((omr: any) => omr[totalWrongHeader]);
    
        this.fieldsDataResultant[totalRightHeader] = totalRightMarks;
        this.fieldsDataResultant[totalWrongHeader] = totalWrongMarks;
      } else {
        delete this.fieldsDataResultant["Total Right Marks"];
        delete this.fieldsDataResultant["Total Wrong Marks"];
      }
    }else if(header =='Total Marks'){
      if (isChecked) {
        const totalMarksHeader = "Total Marks";
    
        const totalMarks = this.data.resultData.map((omr: any) => omr[totalMarksHeader]);
    
        this.fieldsDataResultant[totalMarksHeader] = totalMarks;
      } else {
        delete this.fieldsDataResultant["Total Marks"];
      }
    }

console.log("this.fieldsDataResultant", this.fieldsDataResultant);


  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // this.resultant =

    console.log("omrDataResultant", this.omrDataResultant);
    console.log("studentDataResultant", this.studentDataResultant);

    // Merge multiple objects
    this.resultant = Object.assign({}, this.omrDataResultant, this.studentDataResultant, this.onFieldsCheckboxChange);

    console.log(this.resultant);

    // Perform further actions with the resultant data
    this.dialogRef.close(this.resultant);
  }

}
