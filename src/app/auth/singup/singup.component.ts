import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss']
})
export class SingupComponent implements OnInit {
  isLoading = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSingup(singupForm: NgForm) {
    if(singupForm.invalid) return;
    this.isLoading = true;
    this.authService.createUser(singupForm.value.email, 
      singupForm.value.password);
  }

}
