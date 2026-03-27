# Angular 21 Best Practices & Vitest Testing Guidelines

## Framework Context

- **Angular Version**: 21 (Zoneless by default)
- **Reactivity**: Signals-first (Signal inputs, Signal-based forms, computed, linkedSignal).
- **Architecture**: 100% Standalone components; NgModules are legacy.
- **Change Detection**: Zoneless (No Zone.js). Change detection is triggered by Signal updates, user events, or explicit markForCheck.

## Angular 21 Coding Standards

- **Component Setup**: Always use `standalone: true`. Default to `changeDetection: ChangeDetectionStrategy.OnPush`.
- **Signal Usage**:
  - Use `signal()`, `computed()`, and `linkedSignal()` for state.
  - Use Signal Inputs: `name = input<string>();`.
  - Use Signal Outputs: `clicked = output<void>();`.
- **Dependency Injection**: Prefer the `inject()` function over constructor injection for better type safety and tree-shaking.
- **New Control Flow**: Use `@if`, `@for`, and `@switch` syntax. For `@switch`, you can now match multiple cases: `@case ('A', 'B')`.
- **Signal Forms**: Use the new `form()` API and `[formField]` directive for reactive, type-safe forms without Observables.

<!-- ## Unit Testing Rules (Vitest)
- **Globals**: Use `import { describe, it, expect, vi, beforeEach } from 'vitest';`.
- **Zoneless Testing**:
  - Do NOT rely on `fakeAsync` or `tick()`; they require Zone.js.
  - Use `await fixture.whenStable()` to wait for async Signal updates or Microtasks.
  - Use `provideExperimentalZonelessChangeDetection()` in `TestBed` if forcing a zoneless environment.
- **Signal Assertions**: Always call signals as functions in assertions: `expect(component.data()).toEqual(mockData);`.
- **Mocking**: Use `vi.fn()` or `vi.spyOn()`. For services, use `vi.mocked(service)` for type-safe spies.
- **DOM Interaction**: Use `fixture.componentRef.setInput('prop', value)` to test Signal inputs. -->

## Performance & Modernization

- **Lifecycle Hooks**: Use `afterNextRender` or `afterEveryRender` for DOM-dependent logic instead of `ngAfterViewInit`.
- **API Cleanup**: Avoid `NgZone` observables (`onStable`, `isStable`); use the `PendingTasks` service or render hooks instead.
- **Hydration**: Ensure components are hydration-compatible for SSR; avoid direct DOM manipulation.
