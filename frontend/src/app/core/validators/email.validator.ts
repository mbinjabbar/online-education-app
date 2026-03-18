import { AbstractControl, ValidationErrors } from "@angular/forms";
import isEmail from "validator/lib/isEmail";

export const emailValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    return isEmail(value) ? null : { invalidEmail: true }
}