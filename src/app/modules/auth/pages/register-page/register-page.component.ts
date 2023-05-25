import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {RegisterFormComponent} from "../../components/register-form/register-form.component";

@Component({
  selector: 'app-register-page',
  template: ''
})
export class RegisterPageComponent implements OnInit{
  constructor(private matDialog: MatDialog) {
  }
  ngOnInit(): void {
    this.matDialog.open(RegisterFormComponent, {
      // disableClose:true
      })
  }

}
