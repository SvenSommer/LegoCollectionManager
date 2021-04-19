import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private loginService: LoginService,private toastr: ToastrService) { }

  public userName = '';
  public password = '';

  ngOnInit(): void {
  }


  onSubmit(signupForm: NgForm) {

    if (!signupForm.valid) {
      return;
    }
    this.loginService.login(this.userName, this.password).subscribe(
      (data) => {
        if (data.body.code == 200) {
          localStorage.setItem("SessionUser", this.userName);
          this.router.navigateByUrl("/collection");
          this.toastr.success(data.body.message);
        }
        else {
          this.toastr.error(data.body.message);
        }
      },
      (error: HttpErrorResponse) => {
        //console.log('[getUSers] error : ', error);
        //console.log(error.name + ' ' + error.message);
        return false;
      }
    );
  }
}
