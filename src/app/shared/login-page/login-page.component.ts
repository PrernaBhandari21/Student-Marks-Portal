import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent  {

  constructor(private authService : AuthService){}

  username: string | undefined;
  password: string | undefined;

  onSubmit() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);

    const authSuccess = this.authService.login(this.username, this.password)
    if(!authSuccess){
      alert("Inavlid Credentials! Please try again.")
    }
  }
}
