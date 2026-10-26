# Sprint — Accessibility

Target: **WCAG 2.2 Level AA** (W3C, 2023, https://www.w3.org/TR/WCAG22/). This file records how the prototype meets each relevant success criterion and where in the code. It is a self-assessment from a code review, not a formal audit (see "Not yet verified" below).

## Success criteria met

| Criterion | Level | How Sprint meets it | Where |
|---|---|---|---|
| 1.1.1 Non-text Content | A | Decorative icons are `aria-hidden`; icon-only buttons have `aria-label`s; charts have a text equivalent (burndown table view, screen-reader list of daily completions, values written beside every bar) | `TaskCard.jsx`, `InsightsDrawer.jsx`, `BurndownChart.jsx` |
| 1.3.1 Info and Relationships | A | Landmarks (`header`, `nav`, `main`, `role="search"`); one `h1`, sections and columns as `h2`, drawer content below; form fields have `<label>`s or `fieldset`/`legend`; column sections are named by their heading; Markdown preview headings are shifted below the drawer's | `App.jsx`, `Board.jsx`, `Drawer.jsx`, `ContextField.jsx` |
| 1.3.2 Meaningful Sequence | A | DOM order matches visual order; menus and popovers follow their button in the DOM | `TaskCard.jsx`, `TeamStrip.jsx` |
| 1.3.5 Identify Input Purpose | AA | Team-member fields describe other people, so `autoComplete="off"` stops the browser filling in the user's own details | `TeamDrawer.jsx` |
| 1.4.1 Use of Color | A | Due state has an icon and a text label ("Due tomorrow", "2 days overdue"); task type has a distinct icon and screen-reader label; deliverable status says "Linked" / "No link yet"; "My tasks" shows a tick when on; errors have an icon and text | `DueChip.jsx`, `taskTypes.js`, `AnchorBoard.jsx`, `FilterBar.jsx` |
| 1.4.3 Contrast (Minimum) | AA | Body text 17.9:1; muted text `#475569` ≥ 7:1 on every surface (was 4.39:1 on grey columns); selected type labels use dark text; white on brand 6.3:1 | `tailwind.config.js` |
| 1.4.4 Resize Text | AA | All sizes in `rem`/`px` that scale with browser zoom to 200%; no fixed-height text containers | — |
| 1.4.10 Reflow | AA | At 320 px wide the board columns, deliverable cards, header, filters and drawer fields stack into one column; no sideways scrolling | `Board.jsx`, `AnchorBoard.jsx`, `App.jsx`, `FilterBar.jsx`, drawers |
| 1.4.11 Non-text Contrast | AA | Input and select borders `#7B8799` (3.6:1, was 1.5:1); focus rings brand indigo (6.3:1); due icons darkened to ≥ 4:1; burndown "ideal" line and empty status dots `slate-500` (4.8:1) | `tailwind.config.js`, `BurndownChart.jsx`, `AnchorBoard.jsx` |
| 1.4.12 Text Spacing | AA | No fixed heights on text; long names truncate with the full text in a `title` | — |
| 1.4.13 Content on Hover or Focus | AA | The burndown tooltip stays while hovered, does not block the pointer, and Esc dismisses it; the same data is in the table view | `BurndownChart.jsx` |
| 2.1.1 Keyboard | A | Every action is a native button, link, input or select; drag-and-drop has the status dropdown as its keyboard alternative; hand-off is a keyboard-operable menu | `TaskCard.jsx`, `TaskDrawer.jsx` |
| 2.1.2 No Keyboard Trap | A | Drawers trap focus on purpose (modal) but Esc, Cancel and Close always leave; popover menus close on Esc | `Drawer.jsx`, `TaskCard.jsx`, `TeamStrip.jsx` |
| 2.2.1 Timing Adjustable | A | Toasts stay 6 s and pause while hovered; nothing else is timed | `Toast.jsx` |
| 2.3.3 Animation from Interactions | AAA (best practice) | The OS "reduce motion" setting turns off the toast fade and transitions | `index.css` |
| 2.4.1 Bypass Blocks | A | "Skip to board" link is the first focusable element | `App.jsx` |
| 2.4.2 Page Titled | A | Page title "Sprint" | `index.html` |
| 2.4.3 Focus Order | A | Drawers move focus to their first field and return it to the opener on close; menus return focus to their button | `Drawer.jsx`, `TaskCard.jsx`, `TeamStrip.jsx` |
| 2.4.4 Link Purpose (In Context) | A | Deliverable links say "Open {name} (new tab)"; links in Markdown context say "(opens in a new tab)" to screen readers | `AnchorBoard.jsx`, `ContextField.jsx` |
| 2.4.6 Headings and Labels | AA | Headings name each section; labels say what to enter ("Title (required)") | — |
| 2.4.7 Focus Visible | AA | Every control has a 2 px indigo focus ring; Tailwind's `outline-none` keeps a transparent outline, so a focus outline still shows in Windows High Contrast | all components |
| 2.4.11 Focus Not Obscured (Minimum) | AA | No sticky headers; the toast is small, transient and lets clicks through around it | `Toast.jsx` |
| 2.5.3 Label in Name | A | Accessible names start with the visible text (for example the deliverable task count and the hand-off button) | `AnchorBoard.jsx`, `TaskCard.jsx` |
| 2.5.7 Dragging Movements | AA | Moving a card by drag can also be done with a single click: open the card, change Status | `Board.jsx`, `TaskDrawer.jsx` |
| 2.5.8 Target Size (Minimum) | AA | Interactive targets are at least 24 × 24 px (hand-off, copy, sub-requirement rows and remove buttons, deliverable count, chart toggle were enlarged) | `TaskCard.jsx`, `SubtaskList.jsx`, `AnchorBoard.jsx`, `BurndownChart.jsx` |
| 3.1.1 Language of Page | A | `<html lang="en">` | `index.html` |
| 3.2.1 On Focus / 3.2.2 On Input | A | Focus never changes context. Hand-off is a menu button, not a `<select>`, so browsing names with arrow keys no longer hands the task off on every key press | `TaskCard.jsx` |
| 3.3.1 Error Identification | A | Invalid fields get `aria-invalid` and a red border; the error is described in text with an icon (blank or duplicate names, empty column or milestone, bad link) | `TeamDrawer.jsx`, `BoardSettingsDrawer.jsx`, `AnchorBoard.jsx`, `Drawer.jsx` |
| 3.3.2 Labels or Instructions | A | Required title is labelled "(required)" with a hint explaining why Save is unavailable; settings explain the column-removal rule | `TaskDrawer.jsx`, `BoardSettingsDrawer.jsx` |
| 3.3.3 Error Suggestion | AA | Error messages say how to fix the problem ("Try one starting with https://", "Hand them off before removing") | `AnchorBoard.jsx`, `TeamDrawer.jsx` |
| 3.3.4 Error Prevention | AA | Deleting a task or board asks for confirmation; a member who owns tasks can't be removed | `TaskDrawer.jsx`, `BoardSettingsDrawer.jsx`, `TeamDrawer.jsx` |
| 3.3.7 Redundant Entry | A | Nothing has to be typed twice; new tasks default to the signed-in user and the chosen column | `App.jsx` |
| 3.3.8 Accessible Authentication (Minimum) | AA | Sign-in is picking a name or "Continue as demo user"; no password or memory test | `SignIn.jsx` |
| 4.1.2 Name, Role, Value | A | Native controls throughout; toggles use `aria-pressed`, disclosures `aria-expanded`/`aria-controls`, drawers `role="dialog"` + `aria-modal` + `aria-labelledby` | all components |
| 4.1.3 Status Messages | AA | Toasts use `role="status"`; filter counts and form errors use live regions that are always rendered, so changes are announced | `Toast.jsx`, `FilterBar.jsx`, `Drawer.jsx`, `AnchorBoard.jsx` |

Criteria for media (1.2.x), audio control (1.4.2), images of text (1.4.5), keyboard shortcuts (2.1.4), pointer gestures (2.5.1), pointer cancellation (2.5.2) and motion actuation (2.5.4) don't apply: the app has none of those features, or uses only native click events.

## Not yet verified

- Not yet tested with a real screen reader (NVDA, VoiceOver) or an automated checker (axe, WAVE, Lighthouse). Those would confirm the self-assessment above.
- Drag-and-drop itself is pointer-only. The keyboard path is the Status field in the task drawer (2.5.7), not keyboard dragging.
- "New board", "Delete" and "Reset demo data" use the browser's own `prompt`/`confirm` dialogs, which are accessible but can't be styled.
- The board switcher is a `<select>`: in some browsers, arrowing through it switches boards straight away. It only changes what is shown, and filters reset, so nothing is lost.
