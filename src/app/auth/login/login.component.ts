import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  //1234, admin@t.com
  onLogin(loginForm: any) {
    this.isLoading = true;
    this.authService.login(loginForm.value.email, loginForm.value.password);
  }
}
