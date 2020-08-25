/** Utility to dispatch any event on a Node. */
export function dispatchEvent(node: Node | Window, event: Event): Event {
  node.dispatchEvent(event);
  return event;
}

/** Creates a fake event object with any desired event type. */
export function createFakeEvent(
  type: string,
  canBubble = false,
  cancelable = true
) {
  const event = document.createEvent('Event');
  event.initEvent(type, canBubble, cancelable);
  return event;
}

/** Shorthand to dispatch a fake event on a specified node. */
export function dispatchFakeEvent(
  node: Node | Window,
  type: any,
  canBubble?: boolean
): Event {
  return dispatchEvent(node, createFakeEvent(type, canBubble));
}

/** Shorthand to dispatch a keyboard event with a specified key code. */
export function dispatchKeyboardEvent(
  node: Node,
  type: any,
  keyCode: any,
  target?: Element
): KeyboardEvent {
  return dispatchEvent(
    node,
    createKeyboardEvent(type, keyCode, target)
  ) as KeyboardEvent;
}

export function patchElementFocus(element: HTMLElement) {
  element.focus = () => dispatchFakeEvent(element, 'focus');
  element.blur = () => dispatchFakeEvent(element, 'blur');
}

/** Shorthand to dispatch a mouse event on the specified coordinates. */
export function dispatchMouseEvent(
  node: Node,
  type: string,
  x = 0,
  y = 0,
  event = createMouseEvent(type, x, y)
): MouseEvent {
  return dispatchEvent(node, event) as MouseEvent;
}

export function createMouseEvent(type: string, x = 0, y = 0, button = 0) {
  const event = document.createEvent('MouseEvent');

  event.initMouseEvent(
    type,
    true /* canBubble */,
    false /* cancelable */,
    window /* view */,
    0 /* detail */,
    x /* screenX */,
    y /* screenY */,
    x /* clientX */,
    y /* clientY */,
    false /* ctrlKey */,
    false /* altKey */,
    false /* shiftKey */,
    false /* metaKey */,
    button /* button */,
    null /* relatedTarget */
  );

  // `initMouseEvent` doesn't allow us to pass the `buttons` and
  // defaults it to 0 which looks like a fake event.
  Object.defineProperty(event, 'buttons', { get: () => 1 });

  return event;
}

/** Dispatches a keydown event from an element. */
export function createKeyboardEvent(
  type: string,
  keyCode: number,
  target?: Element,
  key?: string
) {
  const event = document.createEvent('KeyboardEvent') as any;
  const originalPreventDefault = event.preventDefault;

  // Firefox does not support `initKeyboardEvent`, but supports `initKeyEvent`.
  if (event.initKeyEvent) {
    event.initKeyEvent(type, true, true, window, 0, 0, 0, 0, 0, keyCode);
  } else {
    event.initKeyboardEvent(type, true, true, window, 0, key, 0, '', false);
  }

  // Webkit Browsers don't set the keyCode when calling the init export function.
  // See related bug https://bugs.webkit.org/show_bug.cgi?id=16735
  Object.defineProperties(event, {
    keyCode: { get: () => keyCode },
    key: { get: () => key },
    target: { get: () => target }
  });

  // IE won't set `defaultPrevented` on synthetic events so we need to do it manually.
  event.preventDefault = function () {
    Object.defineProperty(event, 'defaultPrevented', { get: () => true });
    return originalPreventDefault.apply(this, arguments);
  };

  return event;
}
/**
 * Gets a RegExp used to detect an angular wrapped error message.
 */
export function wrappedErrorMessage(e: Error) {
  const escapedMessage = e.message.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  return new RegExp(escapedMessage);
}
