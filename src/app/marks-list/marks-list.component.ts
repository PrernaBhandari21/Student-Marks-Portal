import { Component, OnInit } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-marks-list',
  templateUrl: './marks-list.component.html',
  styleUrls: ['./marks-list.component.css']
})
export class MarksListComponent implements OnInit {

  constructor() { }

 


  studentsData=[
    {
      "S No": 1,
      "Roll No": 120001,
      "Student Name": "Rahul",
      "Marks": 28
    },
    {
      "S No": 2,
      "Roll No": 120002,
      "Student Name": "Mohan Kumar",
      "Marks": 89
    },
    {
      "S No": 3,
      "Roll No": 120003,
      "Student Name": "Pradeep Singh",
      "Marks": 98
    },
    {
      "S No": 4,
      "Roll No": 120004,
      "Student Name": "Pandey Tushar",
      "Marks": 19
    },
    {
      "S No": 5,
      "Roll No": 120005,
      "Student Name": "Pooja",
      "Marks": 39
    },
    {
      "S No": 6,
      "Roll No": 120006,
      "Student Name": "Manisha Kumari",
      "Marks": 45
    },
    {
      "S No": 7,
      "Roll No": 120007,
      "Student Name": "Tanisha Jha",
      "Marks": 65
    },
    {
      "S No": 8,
      "Roll No": 120008,
      "Student Name": "Mohit Ranjan",
      "Marks": 88
    },
    {
      "S No": 9,
      "Roll No": 120009,
      "Student Name": "Ashutosh Singh",
      "Marks": 66
    },
    {
      "S No": 10,
      "Roll No": 120010,
      "Student Name": "Purshotam",
      "Marks": 90
    }
  ]


 // Define the columns to display in the table
 displayedColumns: string[] = [];

 // Define the data source for the table
 dataSource = new MatTableDataSource<any>();


 ngOnInit() {
   // Assuming the JSON data is assigned to a variable named 'studentsData'
   if (this.studentsData && this.studentsData.length > 0) {

     // Extract the columns from the first item in the data array
     this.displayedColumns = Object.keys(this.studentsData[0]);
     console.log("this.displayedColumns",this.displayedColumns);

     // Assign the data to the data source
     this.dataSource.data = this.studentsData;
     console.log("this.dataSource.data",this.dataSource.data);
   }
 }
}

