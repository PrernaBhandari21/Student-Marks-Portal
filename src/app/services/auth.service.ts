import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as e from 'express';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router : Router) { }

  username = "Techbets";
  password = "Tech@123";


  login(userId:any, password:any){
    if(userId == this.username && password == this.password){
      this.router.navigate(["about-us"])
      return true;
    }else{
      return false;
    }
  }
}
