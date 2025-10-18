import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,AbstractControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmedPasswordValidator } from 'src/app/helpers/confirm-password.validator';
import ValidateForm from 'src/app/helpers/validateform';
import { ResetPassword } from 'src/app/models/reset-password.model';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  resetPasswordForm!:FormGroup;
  emailToReset!:string;
  emailToken!:string;
  resetPasswordObj = new ResetPassword();

  constructor(private fb:FormBuilder,private acivatedRoute:ActivatedRoute,private toastr:ToastrService,private resetPasswordService:ResetPasswordService,private router:Router) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      newPassword:[null,Validators.required     
                    // [ Validators.minLength(6),
                    //     this.hasUppercase,
                    //     this.hasNumber,
                    //     this.hasSpecialCharacter ]
        
      ],
      confirmPassword:[null,Validators.required],
    },
    { validator : ConfirmedPasswordValidator("newPassword","confirmPassword")
      //,validator: this.passwordMatchValidator 
      }
  );
        this.acivatedRoute.queryParams.subscribe(val=>{
            this.emailToReset = val['email'];
            let urlToken = val['code'];
            this.emailToken = urlToken.replace(/ /g,'+')
            console.log(this.emailToReset);
            console.log(this.emailToken);
        })
  }

  resetPassword(){
    if(this.resetPasswordForm.valid){
        this.resetPasswordObj.email = this.emailToReset;
        this.resetPasswordObj.newPassword = this.resetPasswordForm.value.newPassword;
        this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
        this.resetPasswordObj.emailToken = this.emailToken;

        this.resetPasswordService.resetPassword(this.resetPasswordObj)
        .subscribe({
            next:(res)=>{
                this.toastr.success("Password Reset Successfully..","Success");
                this.resetPasswordForm.reset();
                this.router.navigate(['login']);  
            },
            error:(err)=>{
                this.toastr.error("Something went wrong.","Error");
            }
        })
    }
    else{
        ValidateForm.addValidatorsToAllFields(this.resetPasswordForm);
    }
  }

  // Custom validator to check if passwords match
    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;
        if (password !== confirmPassword) {
            return { passwordMismatch: true };
        }
        return null;
    }

    // Custom validator to check if the password contains at least one uppercase letter
    hasUppercase(control: AbstractControl) {
        const value = control.value;
        if (value && !/[A-Z]/.test(value)) {
            return { uppercase: true };
        }
        return null;
    }

    // Custom validator to check if the password contains at least one number
    hasNumber(control: AbstractControl) {
        const value = control.value;
        if (value && !/\d/.test(value)) {
            return { number: true };
        }
        return null;
    }

     // Custom validator to check if the password contains at least one special character
    hasSpecialCharacter(control: AbstractControl) {
        const value = control.value;
        if (value && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            return { specialCharacter: true };
        }
        return null;
    }



}
