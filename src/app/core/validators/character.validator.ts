import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Letras y números.
export function isAlphanumeric(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[a-zA-Z0-9]*$/;
    return regex.test(control.value) ? null : { notAlphanumeric: true };
  };
}

// Letras, números y espacios.
export function isAlphanumericWithSpaces(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[A-Za-z0-9\s]+$/g;
    return regex.test(control.value)
      ? null
      : { notAlphanumericWithSpaces: true };
  };
}

// Letras.
export function isAlpha(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[a-zA-Z]+$/;
    return regex.test(control.value) ? null : { notAlpha: true };
  };
}

// Números.
export function isNumeric(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[0-9]+$/;
    return regex.test(control.value) ? null : { notNumeric: true };
  };
}

// Distinto de espacios.
export function notOnlySpaces(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^\s+$/;
    return regex.test(control.value) ? { onlySpaces: true } : null;
  };
}

// Distinto de cero.
export function notZeroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value !== 0 ? null : { differentFromZero: true };
  };
}

// Distinto de caracter especial.
export function noSpecialCharacters(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[a-zA-Z0-9\s]*$/;
    return regex.test(control.value) ? null : { hasSpecialCharacters: true };
  };
}

// Porcentaje.
export function isPercentage(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^((?:|0|[1-9]\d?|100)(?:\.\d{1,2})?)$/;
    return regex.test(control.value) ? null : { notPercentage: true };
  };
}

// Letras, números, espacios y puntos.
export function isAlphanumericWithPointAndSpaces(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[a-zA-Z0-9.\s]+$/;
    return regex.test(control.value)
      ? null
      : { notAlphanumericWithPoint: true };
  };
}

export function getErrorMessage(control: any) {
  if (control.errors?.['required']) {
    return `Este campo es obligatorio.`;
  } else {
    if (control.errors?.['minlength']) {
      return `Debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres.`;
    }
    if (control.errors?.['maxlength']) {
      return `No puede tener más de ${control.errors?.['maxlength'].requiredLength} caracteres.`;
    }
    if (control.errors?.['notAlphanumeric']) {
      return `Solo se permiten letras y números.`;
    }
    if (control.errors?.['notAlphanumericWithSpaces']) {
      return `No puede tener caracteres especiales.`;
    }
    if (control.errors?.['notAlpha']) {
      return `Solo se permiten letras.`;
    }
    if (control.errors?.['notNumeric']) {
      return `Solo se permiten números.`;
    }
    if (control.errors?.['onlySpaces']) {
      return `No puede tener solo espacios en blanco.`;
    }
    if (control.error?.['notAlphanumericWithPoint']) {
      return `No puede tener caracteres especiales.`;
    }
    if (control.errors?.['notPercentage']) {
      return `Debe ser un número que represente un porcentaje. Ej: 1.5`;
    }
    if (control.errors?.['pattern']) {
      return `No puede tener letras o caracteres especiales.`;
    }
  }
  return '';
}

// Verificar
export function isAlphanumericWithSlash(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[a-zA-Z0-9\/]*$/;
    return regex.test(control.value)
      ? null
      : { notAlphanumericWithSlash: true };
  };
}
