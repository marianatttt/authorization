import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {AuthService} from "../../services";
import {IAuth} from "../../interfaces";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: IAuth | null;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.getAuthUser().subscribe(value => {
      if (value) {
        this.user = value
      } else {
        this.authService.me().subscribe(value => this.user = value)
      }

    })
  }

  logout() {
    this.authService.deleteToken();
    this.user = null;
    this.router.navigate(['/'])

  }
}
