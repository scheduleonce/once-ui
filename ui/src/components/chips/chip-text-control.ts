/** Interface for a text control that is used to drive interaction with an oui-chip-grid. */
export interface OuiChipTextControl {
  /** Unique identifier for the text control. */
  id: string;

  /** The text control's placeholder text. */
  placeholder: string;

  /** Whether the text control has browser focus. */
  focused: boolean;

  /** Whether the text control is empty. */
  empty: boolean;

  /** Focuses the text control. */
  focus(): void;

  /** Gets the list of ids the input is described by. */
  readonly describedByIds?: string[];

  /** Sets the list of ids the input is described by. */
  setDescribedByIds(ids: string[]): void;
}
