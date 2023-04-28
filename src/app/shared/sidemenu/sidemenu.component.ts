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
        label:"Home Page",
        link:"/",
        icon:"question_answer"
      },
      {
        label:"Create Report",
        link:"/create-report",
        icon:"group"
      },
      {
        label:"Result Calculation",
        link:"/result-calculation",
        icon:"library_add"
      },
      {
        label:"Schedules",
        link:"/schedules",
        icon:"library_add"
      },

      {
        label:"Coupons",
        link:"/coupons",
        icon:"redeem"
      },
      {
        label:"All Vendor",
        link:"/all-vendor",
        icon:"people_outline"
      },
      {
        label:"Bookings",
        link:"/bookings",
        icon:"account_balance_wallet"
      },
      {
        label:"Enquiries",
        link:"/enquiryForms",
        icon:"question_answer"
      },
      {
        label:"Ratings",
        link:"/ratings",
        icon:"stars"
      },
      {
        label:"Settings",
        link:"/settings",
        icon:"settings"
      },
      {
        label:"Dashboard",
        link:"/dashboard",
        icon:"question_answer"
      },
      
      
      
    ]

  }

}
