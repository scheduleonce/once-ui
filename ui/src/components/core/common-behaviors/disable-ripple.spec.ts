import { describe, expect, it } from 'vitest';
import { mixinDisableRipple } from './disable-ripple';

describe('mixinDisableRipple', () => {
  it('should augment an existing class with a disableRipple property', () => {
    const classWithMixin = mixinDisableRipple(TestClass);
    const instance = new classWithMixin();

    expect(instance.disableRipple).toBe(false);

    instance.disableRipple = true;

    expect(instance.disableRipple).toBe(true);
  });

  it('should coerce values being passed to the disableRipple property', () => {
    const classWithMixin = mixinDisableRipple(TestClass);
    const instance = new classWithMixin();

    expect(instance.disableRipple).toBe(false);

    // Setting string values to the disableRipple property should be prevented by TypeScript's
    // type checking, but developers can still set string values from their template bindings.
    (instance as any).disableRipple = '';

    expect(instance.disableRipple).toBe(true);
  });
});

class TestClass {}
