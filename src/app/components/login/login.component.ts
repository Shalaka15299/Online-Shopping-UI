import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 
  type:string = "password";
  isText:boolean = false;
  eyeIcon:string = "fa-eye-slash";

  loginForm!:FormGroup;
  constructor(private fb:FormBuilder,private auth:AuthService,private router:Router,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loginForm =this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
  }

  onLogin(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value);

      //send the obj to  database
      this.auth.login(this.loginForm.value)
      .subscribe({
        next:(res)=>{
          //  alert(res.message);
          console.log(res.message);
          this.loginForm.reset();
           this.toastr.success(res.message,"SUCCESS");
          this.router.navigate(['login']);
        },
        error:(err)=>{
          console.log(err);
          this.toastr.error(err?.error.message,"Error");
          // alert(err?.error.message);
        }
      })
    }
    else{
      //throw the error using toaster and with required fields
      ValidateForm.addValidatorsToAllFields(this.loginForm);
      this.toastr.error("Please fill all the required fields","Error");
      // alert("Please fill all the required fields");
      console.log("form is not valid");

    }
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" :this.type = "password";
  }

  
}
