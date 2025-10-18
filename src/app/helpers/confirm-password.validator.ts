import { FormGroup } from '@angular/forms';   

export function ConfirmedPasswordValidator(controlName: string, matchingControlName: string){

    return (formGroup: FormGroup) => {

        const newPasswordcontrol = formGroup.controls[controlName];

        const confirmPasswordmatchingControl = formGroup.controls[matchingControlName];

        if (confirmPasswordmatchingControl.errors && !confirmPasswordmatchingControl.errors['ConfirmedPasswordValidator']) {

            return;

        }

        if (newPasswordcontrol.value !== confirmPasswordmatchingControl.value) {

            confirmPasswordmatchingControl.setErrors({ ConfirmedPasswordValidator: true });
           

        } else {

            confirmPasswordmatchingControl.setErrors(null);
        
        }

    }

}