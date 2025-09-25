import { FormControl, FormGroup } from "@angular/forms";

export default class ValidateForm{
// Method to add validators to all fields in a form
     static addValidatorsToAllFields(form: FormGroup) {
      Object.keys(form.controls).forEach((field) => {
        const control = form.get(field);
        if (control instanceof FormControl) {
          control.markAsDirty({onlySelf:true});
        }
        else if(control instanceof FormGroup){
          this.addValidatorsToAllFields(control);
        }
      });
    }
}