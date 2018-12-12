/** @docs-private */
export function getOuiFormFieldMissingControlError(): Error {
  return Error('mat-form-field must contain a OuiFormFieldControl.');
}
