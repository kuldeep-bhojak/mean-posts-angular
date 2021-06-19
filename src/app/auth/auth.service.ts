import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, timer } from 'rxjs';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string = '';
  private authStatusListner = new Subject<boolean>();
  private isAuth = false;
  private tokenTimer: any;
  
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }
  getIsAuth() {
    return this.isAuth;
  }
  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.http.post('http://localhost:3000/api/user/signup', authData)
    .subscribe(res => {
      console.log(res);
    });
  }
  
  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', authData)
    .subscribe(res => {
      this.token = res.token;
      const expiresIn = res.expiresIn;
      this.setAuthTimer(expiresIn);
      this.authStatusListner.next(true);
      this.isAuth = true;
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresIn * 1000);
      this.saveAuthData(this.token, expirationDate);
      this.router.navigate(['/']);
    });
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    const now = new Date();
    if(authInfo) {
      const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
      if(expiresIn > 0) {
        this.token = authInfo.token;
        this.isAuth = true;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListner.next(true);
      }
    }
  }

  logout() {
    this.token = '';
    this.authStatusListner.next(false);
    this.router.navigate(['/']);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }
  
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', this.token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    if(!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate)
    }
  }
}
