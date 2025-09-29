import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  type:string = "password";
  isText:boolean = false;
  eyeIcon:string = "fa-eye-slash";
  signupForm!:FormGroup;
  constructor(private fb:FormBuilder,private auth:AuthService,private router:Router) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstname:['',Validators.required],
      lastname:['',Validators.required],
      email:['',Validators.required],
      username:['',Validators.required],
      password:['',Validators.required]
    })

  }

  onSignup(){
    if(this.signupForm.valid){
      console.log(this.signupForm.value);

      //send the obj to database
      this.auth.signup(this.signupForm.value)
      .subscribe({
        next:(res)=>{
          alert(res.message);
          this.signupForm.reset();
          this.router.navigate(['login']);
        },
        error:(err)=>{
          alert(err?.error.message);
        }
      })
    }
    else{
      //throw the error using toaster and with required fields
      ValidateForm.addValidatorsToAllFields(this.signupForm);
      alert("Please fill all the required fields");
      console.log("form is not valid");

    }
  }

   hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" :this.type = "password";
  }

  
    
}
