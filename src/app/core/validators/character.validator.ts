import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isAlphanumeric(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[a-zA-Z0-9]*$/;
    return regex.test(control.value) ? null : { notAlphanumeric: true };
  };
}

export function isAlphanumericWithSpaces(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[A-Za-z0-9\s]+$/g;
    return regex.test(control.value)
      ? null
      : { notAlphanumericWithSpaces: true };
  };
}

export function isNumeric(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[0-9]+$/;
    return regex.test(control.value) ? null : { notNumeric: true };
  };
}

export function isPercentage(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^((?:|0|[1-9]\d?|100)(?:\.\d{1,2})?)$/;
    return regex.test(control.value) ? null : { notPercentage: true };
  };
}

export function isAlphanumericWithSlash(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[a-zA-Z0-9\/]*$/;
    return regex.test(control.value)
      ? null
      : { notAlphanumericWithSlash: true };
  };
}

export function isAlphanumericWithPointAndSpaces(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[a-zA-Z0-9.\s]+$/;
    return regex.test(control.value)
      ? null
      : { notAlphanumericWithPoint: true };
  };
}

export function notZeroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^(?!0)\d+$/;
    return regex.test(control.value) ? null : { notZero: true };
  };
}

export function notOnlySpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[\S]+$/;
    return regex.test(control.value) ? null : { onlySpaces: true };
  };
}

export function isAlpha(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/;
    return regex.test(control.value) ? null : { notAlpha: true };
  };
}
