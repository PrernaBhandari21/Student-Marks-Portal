import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {

  appitems : any= [];

  config = {
    paddingAtStart: true,
    classname: "side-nav-menu",
    fontColor: "#000",
    selectedListFontColor: "#267fff",
    // backgroundColor: "#dad6ff",
    highlightOnSelect: true,
    useDividers: false,
    collapseOnSelect: true,
  };

  constructor() { }

  ngOnInit(): void {

    this.appitems=[
      {
        label:"About Us",
        link:"/",
        icon:"label_important"
      }, 
     {
        label:"Home Page",
        link:"/dashboard",
        icon:"question_answer"
      }, 
      {
        label:"Create Report",
        link:"/create-report",
        icon:"group"
      },
      {
        label:"Complete Report",
        link:"/create-student-report",
        icon:"group"
      },
     
      
      
    ]

  }

}
