/** @docs-private */
export function getOuiInputUnsupportedTypeError(type: string): Error {
  return Error(`Input type "${type}" isn't supported by ouiInput.`);
}
