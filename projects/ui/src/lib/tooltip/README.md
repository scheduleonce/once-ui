# tooltip

Shared tooltip component for user side angular. Does not depend on any other component.

## Usage

Example of simple usage:

```html
<span appTooltip="content to be shown in the tooltip">
    element on which this tooltip is applied.
</span>
```

Example of uses with all configurations:

```html
<span appTooltip="content to be shown in the tooltip"
      [tooltipDisabled]="false"
      tooltipPlacement="top">
    element on which this tooltip is applied.
</span>
```

Example of usage with dynamic html content:

```html
<app-tooltip-content #myTooltip placement="left">
    <b>Very</b> <span style="color: #C21F39">Dynamic</span> <span style="color: #00b3ee">Reusable</span>
    <b><i><span style="color: #ffc520">Tooltip With</span></i></b> <small>Html support</small>.
</app-tooltip-content>

<button [tooltip]="myTooltip">element on which this tooltip is applied.</button>
```

* `<span appTooltip>`:
  * `appTooltip="string"` The message to be shown in the tooltip.
  * `[tooltipDisabled]="true|false"` Indicates if tooltip should be disabled. If tooltip is disabled then it will not be shown. Default is **false**
  * `tooltipPlacement="top|bottom|left|right"` Indicates where the tooltip should be placed. Default is **"top"**.
* `<tooltip-content>`:
  * `placement="top|bottom|left|right"` Indicates where the tooltip should be placed. Default is **"top"**.
