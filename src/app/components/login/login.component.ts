import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 
  public loginForm!:FormGroup;
  type:string = "password";
  isText:boolean = false;
  eyeIcon:string = "fa-eye-slash";
  public resetPasswordEmail!:string;
  public isValidEmail!:boolean;
  
  constructor(private fb:FormBuilder,private auth:AuthService,private router:Router,private toastr: ToastrService,private userStore:UserStoreService,private resetService:ResetPasswordService) { }

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
          this.auth.storeToken(res.accessToken);
          this.auth.storeRefreshToken(res.refreshToken);
          const tokenPayload = this.auth.decodedToken();
          this.userStore.setFullNameForStore(tokenPayload.unique_name);
          this.userStore.setRoleForStore(tokenPayload.role);
           this.toastr.success(res.message,"SUCCESS",{
            // timeOut:3000,
            progressBar:true,
            progressAnimation:'increasing'
           });
          this.router.navigate(['dashboard']);
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

  checkValidEmail(event:string){
    const value = event;
    const pattern =/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend(){
    if(this.checkValidEmail(this.resetPasswordEmail)){
      console.log(this.resetPasswordEmail);     

      //API call
      this.resetService.sendResetPasswordLink(this.resetPasswordEmail)
      .subscribe({
        next:(res)=>{
          this.resetPasswordEmail = "";
          // const btnRef = document.getElementById("btnClose");
          // btnRef?.click();
      document.getElementById("btnClose")?.click();
      
      this.toastr.success("Reset Link sent to your email","Success");
        },
        error:(err)=>{
          this.toastr.error(err?.error.message,"Error");
        }
      });

    }
  }
  
}
