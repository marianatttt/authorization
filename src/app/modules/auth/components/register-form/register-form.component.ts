import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../services";
import {Router} from "@angular/router";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit{
  form:FormGroup

  error:boolean

  constructor(private authService:AuthService, private router: Router, private dialogRef :MatDialogRef<RegisterFormComponent>) {
  }


  ngOnInit(): void {
    this._initForm()
  }

  _initForm(): void {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  register():void {
    console.log(this.form.getRawValue())
    this.authService.register(this.form.getRawValue()).subscribe({
      next: ()=>{
        this.router.navigate(['/auth/login'])
        this.dialogRef.close()
      },
      error:(err)=>{
        console.log(err)
        this.error = true
      },
      complete:()=>{
        this.error = false
      }
    })
  }

}
