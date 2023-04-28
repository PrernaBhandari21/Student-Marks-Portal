import { Component, OnInit , Inject } from '@angular/core';
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
  omrDataResultant:{ [header: string]: any[] } = {};



  constructor(    public dialogRef: MatDialogRef<SelectHeadersComponent>,
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


  // onCheckboxChange(header: string, isChecked: boolean): void {
  //   if (isChecked) {
  //     this.selectedHeaders.push(header);
  //   } else {
  //     const index = this.selectedHeaders.indexOf(header);
  //     if (index >= 0) {
  //       this.selectedHeaders.splice(index, 1);
  //     }
  //   }
  // }

  onStudentCheckboxChange(header: string, isChecked: boolean): void {
    if (isChecked) {
      const headerData = this.data.studentsData.map((student: any) => student[header]);
      this.studentDataResultant[header] = headerData;
    } else {
      delete this.studentDataResultant[header];
    }
  }
  
  onOMRCheckboxChange(header: string, isChecked: boolean): void {
    console.log("header",header);
    console.log(" this.data.omrResponseData.map((omr: any) => omr[header])", this.data.omrResponseData.map((omr: any) => omr[header]));
    if (isChecked) {
      const headerData = this.data.omrResponseData.map((omr: any) => omr[header]);
      this.omrDataResultant[header] = headerData;
    } else {
      delete this.omrDataResultant[header];
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // this.resultant =

    console.log("omrDataResultant",this.omrDataResultant);
    console.log("studentDataResultant",this.studentDataResultant);
    
    // Merge multiple objects
    this.resultant = Object.assign({}, this.omrDataResultant, this.studentDataResultant);

    console.log(this.resultant);

    // Perform further actions with the resultant data
    this.dialogRef.close(this.resultant);
  }

}
