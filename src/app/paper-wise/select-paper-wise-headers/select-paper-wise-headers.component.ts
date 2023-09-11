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
  resultPaperA: any[] = []; // Declare resultPaperA
  resultPaperB: any[] = []; // Declare resultPaperA

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
    
    this.data.combinedResultHeaders
    .forEach((header: any) => {
      this.form.addControl(header, new FormControl(false));
    });
  }


//  form!: FormGroup;

  
  ngOnInit(): void {
    console.log("Got Dataaaaaaaaaaaaaaa : ", this.data);
    this.resultPaperA = this.data.resultPaperA; // Access resultPaperA here
    this.resultPaperB = this.data.resultPaperB; // Access resultPaperB here
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
    else if(header == 'Paper A Marks'){
      this.totalMarksofPaperAData();
    }
    else if(header == 'Paper B Marks'){
      this.totalMarksofPaperBData();
    } 
    else if(header == 'Paper A Topic Wise Marks'){
      console.log("Object.values(this.data.resultPaperA)", Object.values(this.data.resultPaperAHeaders));
      const topicATotalHeaders = Object.values(this.data.resultPaperAHeaders)
        .filter((header: any) => header.includes('Topic') && header.includes('Total'));
      console.log("topicATotalHeaders", topicATotalHeaders);

      // Do something with the fetched headers
      for (let i = 0; i < topicATotalHeaders.length; i++) {
        let headerVal: any = topicATotalHeaders[i]
        console.log("headerVal", headerVal);
        const headerData = this.data.resultPaperA.map((omr: any) => omr[headerVal]);
        console.log("headerData", headerData);
        this.fieldsDataResultant[headerVal] = headerData;
      }
      this.totalMarksofPaperAData();

      console.log("this.fieldsDataResultant....................", this.fieldsDataResultant);
      
    } 
    else if(header == 'Paper B Topic Wise Marks'){
      console.log("Object.values(this.data.resultPaperB)", Object.values(this.data.resultPaperBHeaders));
      const topicBTotalHeaders = Object.values(this.data.resultPaperBHeaders)
        .filter((header: any) => header.includes('Topic') && header.includes('Total'));
      console.log("topicBTotalHeaders", topicBTotalHeaders);

      // Do something with the fetched headers
      for (let i = 0; i < topicBTotalHeaders.length; i++) {
        let headerVal: any = topicBTotalHeaders[i]
        console.log("headerVal", headerVal);
        const headerData = this.data.resultPaperB.map((omr: any) => omr[headerVal]);
        console.log("headerData", headerData);
        this.fieldsDataResultant[headerVal] = headerData;
      }
      this.totalMarksofPaperBData();

      console.log("this.fieldsDataResultant....................", this.fieldsDataResultant);
      
    }
    else if(header == 'Paper A Right Wrong Blank Count'){
      this.totalRWBCountPaperA();
      this.totalMarksofPaperAData();
      console.log("Now fieldsDataResultant", this.fieldsDataResultant);
    }
    else if(header == 'Paper B Right Wrong Blank Count'){
      this.totalRWBCountPaperB();
      this.totalMarksofPaperBData();
      console.log("Now fieldsDataResultant", this.fieldsDataResultant);
    }
    else if(header=='Paper A Topic Wise Right Wrong Blank Count'){
      console.log("Object.values(this.data.resultPaperA)", Object.values(this.data.resultPaperAHeaders));
      const topicATotalHeaders = Object.values(this.data.resultPaperAHeaders)
        .filter((headerA: any) => headerA.includes('Topic') && ((headerA.includes('Right Count') || headerA.includes('Wrong Count')) || headerA.includes('Blank Count') || headerA.includes('Total')));
      console.log("topicATotalHeaders", topicATotalHeaders);

      // Do something with the fetched headers
      for (let i = 0; i < topicATotalHeaders.length; i++) {
        let headerValA: any = topicATotalHeaders[i]
        console.log("headerValA", headerValA);
        const headerDataA = this.data.resultPaperA.map((omr: any) => omr[headerValA]);
        console.log("headerDataA", headerDataA);
        this.fieldsDataResultant[headerValA] = headerDataA;
      }

      this.totalRWBCountPaperA();

      this.totalMarksofPaperAData();

      console.log("this.fieldsDataResultant....................", this.fieldsDataResultant);
    }
    else if(header=='Paper B Topic Wise Right Wrong Blank Count'){
      console.log("Object.values(this.data.resultPaperA)", Object.values(this.data.resultPaperBHeaders));
      const topicBTotalHeaders = Object.values(this.data.resultPaperBHeaders)
        .filter((headerB: any) => headerB.includes('Topic') && ((headerB.includes('Right Count') || headerB.includes('Wrong Count')) || headerB.includes('Blank Count') || headerB.includes('Total')));
      console.log("topicBTotalHeaders", topicBTotalHeaders);

      // Do something with the fetched headers
      for (let i = 0; i < topicBTotalHeaders.length; i++) {
        let headerValB: any = topicBTotalHeaders[i]
        console.log("headerValB", headerValB);
        const headerDataB = this.data.resultPaperB.map((omr: any) => omr[headerValB]);
        console.log("headerDataB", headerDataB);
        this.fieldsDataResultant[headerValB] = headerDataB;
      }

      this.totalRWBCountPaperB();

      this.totalMarksofPaperBData();

      console.log("this.fieldsDataResultant....................", this.fieldsDataResultant);
    }else if(header == 'Total Right Wrong Blank Count' ){
        this.totalRWBCommonCount();
        this.totalMarksCommonData();
        console.log("Now fieldsDataResultant", this.fieldsDataResultant);
      }
    console.log("this.fieldsDataResultant", this.fieldsDataResultant);


  }

  totalRWBCommonCount() {
    const totalRightHeader = "Total Right Count";
    const totalWrongHeader = "Total Wrong Count";
    const totalBlankHeader = "Total Blank Count";

    const totalRightCount = this.data.combinedResult.map((omr: any) => omr[totalRightHeader]);
    const totalWrongCount = this.data.combinedResult.map((omr: any) => omr[totalWrongHeader]);
    const totalBlankCount = this.data.combinedResult.map((omr: any) => omr[totalBlankHeader]);

    this.fieldsDataResultant[totalRightHeader] = totalRightCount;
    this.fieldsDataResultant[totalWrongHeader] = totalWrongCount;
    this.fieldsDataResultant[totalBlankHeader] = totalBlankCount;
  }

  totalRWBCountPaperA() {
    const totalRightHeaderA = "Total Right Count";
    const totalWrongHeaderA = "Total Wrong Count";
    const totalBlankHeaderA = "Total Blank Count";

    const totalRightCountA = this.data.resultPaperA.map((omr: any) => omr[totalRightHeaderA]);
    const totalWrongCountA = this.data.resultPaperA.map((omr: any) => omr[totalWrongHeaderA]);
    const totalBlankCountA = this.data.resultPaperA.map((omr: any) => omr[totalBlankHeaderA]);

    this.fieldsDataResultant[totalRightHeaderA] = totalRightCountA;
    this.fieldsDataResultant[totalWrongHeaderA] = totalWrongCountA;
    this.fieldsDataResultant[totalBlankHeaderA] = totalBlankCountA;
  }

  totalRWBCountPaperB() {
    const totalRightHeaderB = "Total Right Count";
    const totalWrongHeaderB = "Total Wrong Count";
    const totalBlankHeaderB = "Total Blank Count";

    const totalRightCountB = this.data.resultPaperB.map((omr: any) => omr[totalRightHeaderB]);
    const totalWrongCountB = this.data.resultPaperB.map((omr: any) => omr[totalWrongHeaderB]);
    const totalBlankCountB = this.data.resultPaperB.map((omr: any) => omr[totalBlankHeaderB]);

    this.fieldsDataResultant[totalRightHeaderB] = totalRightCountB;
    this.fieldsDataResultant[totalWrongHeaderB] = totalWrongCountB;
    this.fieldsDataResultant[totalBlankHeaderB] = totalBlankCountB;
  }


  totalMarksofPaperBData(){
    const obtainedMarksHeaderB = "Total Marks Obtained"
    const totalMarksHeaderB = "Total Marks";
    const rankB = "Rank";
    const percentageB = "Percentage"
    //console.log("resultPaperB Data:", this.data.resultPaperB);

    const obtainedMarksB = this.data.resultPaperB.map((omr: any) => omr[obtainedMarksHeaderB]);
    const totalMarksB = this.data.resultPaperB.map((omr: any) => omr[totalMarksHeaderB]);
    const allRankB = this.data.resultPaperB.map((omr: any) => omr[rankB]);
    const allPercentageB = this.data.resultPaperB.map((omr: any) => omr[percentageB]);


    this.fieldsDataResultant[obtainedMarksHeaderB] = obtainedMarksB;
    this.fieldsDataResultant[totalMarksHeaderB] = totalMarksB;
    this.fieldsDataResultant[rankB] = allRankB
    this.fieldsDataResultant[percentageB] = allPercentageB
  }

  totalMarksofPaperAData(){
    const obtainedMarksHeaderA = "Total Marks Obtained"
    const totalMarksHeaderA = "Total Marks";
    const rankA = "Rank";
    const percentageA = "Percentage"
    //console.log("resultPaperA Data:", this.data.resultPaperA);

    const obtainedMarksA = this.data.resultPaperA.map((omr: any) => omr[obtainedMarksHeaderA]);
    const totalMarksA = this.data.resultPaperA.map((omr: any) => omr[totalMarksHeaderA]);
    const allRankA = this.data.resultPaperA.map((omr: any) => omr[rankA]);
    const allPercentageA = this.data.resultPaperA.map((omr: any) => omr[percentageA]);


    this.fieldsDataResultant[obtainedMarksHeaderA] = obtainedMarksA;
    this.fieldsDataResultant[totalMarksHeaderA] = totalMarksA;
    this.fieldsDataResultant[rankA] = allRankA
    this.fieldsDataResultant[percentageA] = allPercentageA
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
