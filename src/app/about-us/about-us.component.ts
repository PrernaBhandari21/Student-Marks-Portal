import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  constructor(private route : Router) { }

  ngOnInit(): void {
  }

  navigateToCreateReport(){
    this.route.navigate(["create-report"])

  }
}
