import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
    `.example-spacer {  flex: 1 1 auto; }`,
    `ul { list-style-type:none; display: flex}`
  ]
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  private authListnerSubs: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authListnerSubs = this.authService.getAuthStatusListner().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
  }
  logout(){
    this.authService.logout();
  }
}
