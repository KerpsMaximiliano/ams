import { AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function isAlphanumeric(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[a-zA-Z0-9]*$/;
    return regex.test(control.value) ?
    null
    : {notAlphanumeric:true};
  };
}

export function isAlphanumericWithSpaces(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[A-Za-z0-9\s]+$/g;
    return regex.test(control.value) ?
    null
    : {notAlphanumericWithSpaces:true};
  };
}

export function isNumeric(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[0-9]+$/;
    return regex.test(control.value) ?
    null
    : {notNumeric:true};
  };
}

export function isAlphanumericWithSlash(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[a-zA-Z0-9\/]*$/;
    return regex.test(control.value) ?
    null
    : {notAlphanumericWithSlash:true};
  };
}

export function isAlphanumericWithPointAndSpaces(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[a-zA-Z0-9.\s]+$/;
    return regex.test(control.value) ?
    null
    : {notAlphanumericWithPoint:true};
  };
}

export function notZeroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^(?!0)\d+$/;
    return regex.test(control.value) ?
    null
    : {notZero:true};
  };
}