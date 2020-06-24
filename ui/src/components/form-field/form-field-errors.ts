/** @docs-private */
export function getOuiFormFieldMissingControlError(): Error {
  return Error('oui-form-field must contain a OuiFormFieldControl.');
}
