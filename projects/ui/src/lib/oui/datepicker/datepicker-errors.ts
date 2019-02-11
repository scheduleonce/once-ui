export function createMissingDateImplError(provider: string) {
  return Error(
    `OuiDatepicker: No provider found for ${provider}. You must import one of the following ` +
      `modules at your application root: OuiNativeDateModule, OuiMomentDateModule, or provide a ` +
      `custom implementation.`
  );
}
