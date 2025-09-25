import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidateForm from 'src/app/helpers/validateform';

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
  constructor(private fb:FormBuilder) { }

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
