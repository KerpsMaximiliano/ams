import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Letras y números.
export function isAlphanumeric(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /^[a-zA-Z0-9]*$/;
    return regex.test(control.value) ? null : { notAlphanumeric: true };
  };
}

// Letras, números y espacios.
export function isAlphanumericWithSpaces(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /^[A-Za-z0-9\s]+$/g;
    return regex.test(control.value)
      ? null
      : { notAlphanumericWithSpaces: true };
  };
}

// Letras.
export function isAlpha(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /^[a-zA-Z]+$/;
    return regex.test(control.value) ? null : { notAlpha: true };
  };
}

// Números.
export function isNumeric(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /^[0-9]+$/;
    return regex.test(control.value) ? null : { notNumeric: true };
  };
}

// Decimal.
export function isDecimal(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /^\d{1,3}(?:,\d{1,3})?$/;
    return regex.test(control.value) ? null : { notDecimal: true };
  };
}

// Distinto de espacios.
export function notOnlySpaces(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /^\s+$/;
    return regex.test(control.value) ? { onlySpaces: true } : null;
  };
}

// Distinto de cero.
export function notZeroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /^[1-9][0-9]*$/;
    return regex.test(control.value) ? null : { differentFromZero: true };
  };
}

// No caracter o conjunto de caracteres.
export function notChar(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /[a-zA-Z]+/;
    return !regex.test(control.value) ? null : { isChar: true };
  };
}

// Solo número y coma.
export function isNumberAndComma(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /^[0-9,]*$/;
    return regex.test(control.value) ? null : { notIsNumberAndComma: true };
  };
}

// Máximo dos decimales.
export function onlyTwoDecimal(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /^\d+(,\d{1,2})?$/;
    return regex.test(control.value) ? null : { notOnlyTwoDecimal: true };
  };
}

// Valor máximo: 999999,99
export function isMax(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /^(999999(\.00)?|999999\.99|\d{1,6}(\.\d{1,2})?)$/;
    let value = control.value;
    if (control.value.includes(',')) value = control.value.replace(',', '.');
    return regex.test(value) ? null : { notMax: true };
  };
}

// Valor requerido después de una coma.
export function afterComma(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value.includes(',')) {
      const regex = /,(\S+)/;
      return regex.test(control.value) ? null : { notAfterComma: true };
    }
    return null;
  };
}

export function afterCommaNotZero(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value.includes(',')) {
      const regex = /,0*([1-9]\d*|0[1-9]\d*)/;
      return regex.test(control.value) ? null : { notAfterCommaNotZero: true };
    }
    return null;
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
    if (control.errors?.['differentFromZero']) {
      return `No puede ser 0 (cero).`;
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
    if (control.errors?.['notDecimal']) {
      return `Debe ser un número que represente un decimal o un entero, maximo 3 enteros y 3 decimales. Ej: 121,525`;
    }
    if (control.errors?.['isChar']) {
      return `No se permiten letras.`;
    }
    if (control.errors?.['notIsNumberAndComma']) {
      return `Solo se permite un valor númerico. `;
    }
    if (control.errors?.['notAfterComma']) {
      return `Debe de tener al menos un decimal.`;
    }
    if (control.errors?.['notOnlyTwoDecimal']) {
      return `Solo se permiten hasta 2 (dos) decimales.`;
    }
    if (control.errors?.['notMax']) {
      return `Valor máximo: 999999,99.`;
    }
  }
  return '';
}
