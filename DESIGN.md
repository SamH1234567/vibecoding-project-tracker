# Vibecoding Project Tracker — Design

**Status:** Hackathon starter design doc · fill in the **`<TODO>`** sections before you tag `design-done`.

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here will be visible on every screen for the next six weeks of Module 5.

**Who owns this.** Person B, during the same window the rest of the team is reviewing the PRD. By the time the team converges to start M4 (`data-model`), this file should be filled in and the colors should already be in `tailwind.config.js`.


---

## 1. Mood / vibe

One sentence that captures the feeling the tracker should leave you with.

`A quiet board showing clear progress and what's due next.`

Two or three references that capture the vibe (links to dribbble shots, screenshots of apps you admire, Pinterest boards — anything visual):

- `https://linear.app/`
- `https://culturedcode.com/things/`
- `https://www.notion.com/`

Anti-references — what we are explicitly **not** trying to look like:

- `https://trello.com/ -- too much colour everywhere`

## 2. Color palette

These are the colors the build milestones will reference. Once chosen, paste the hex values into `tailwind.config.js` so the rest of the team can use Tailwind utility classes (e.g. `bg-brand-primary`, `border-due-warning`).

### Brand

| Token | Hex | Where it shows up |
|---|---|---|
| `brand-primary` | `#4F46E5` | Header, "+" button, focus rings |
| `brand-accent` | `#0EA5E9` | Highlights, hover states, links |
| `surface-page` | `#F8FAFC` | Page background |
| `surface-card` | `#FFFFFF` | Card background |
| `text-primary` | `#0F172A` | Body text |
| `text-muted` | `#64748B` | Captions, dates, counts |

### Task type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type-feature` | `#3B82F6` | Cards tagged `feature` (accent stripe + Lucide `Sparkles` icon) |
| `type-bug` | `#9333EA` | Cards tagged `bug` (accent stripe + Lucide `Bug` icon) |

Type colours are deliberately cool hues (blue / purple) so that every warm colour on the board means a due-date state. A purple bug stripe can never be mistaken for an overdue alert.

### Due-date states (M8 `due-tint`)

| Token | Hex | When used |
|---|---|---|
| `due-safe` | `#10B981` | More than 2 days out |
| `due-warning` | `#F59E0B` | Due today or within the next 2 days (covers both the brief's <24 h case and the unspecified 1–2 day gap) |
| `due-overdue` | `#DC2626` | Past due |
| `due-neutral` | `#94A3B8` | Done (overrides date) |

Due state is shown as a tinted date chip on the card. Days are compared as **local calendar days**, not UTC timestamps. Tasks with no due date show no chip.

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Heading | Inter (semibold) | Same family as body keeps the UI quiet; hierarchy comes from weight and size, not a second typeface. |
| Body | Inter (regular) | Designed for screen UI, highly legible at the 12–14 px sizes used on cards. |
| Monospace (tags, badges, code) | JetBrains Mono | Clear distinction between similar glyphs (0/O, 1/l) in prompt context and code snippets. |

Suggested sizes (override only if the design demands it):

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular muted

## 4. Component principles

One short sentence per element. These set the tone for the build phase — Person A's modal and Person B's anchor board should both feel like they came from this doc.

- **Cards:** White, rounded-xl, soft shadow at rest (shadow-sm) that lifts on hover (shadow-md), no border; a 4 px left stripe in the type colour.
- **Buttons:** Rounded-full pills. Primary is solid brand-primary with white text; secondary is white with a slate border. Indigo focus ring on all buttons.
- **Modal:** A full-height drawer docked to the right (max-w-lg, no slide animation per §7) over a slate-900/40 backdrop. It is still a modal dialog: focus is trapped and Esc or a backdrop click closes it. The same drawer is used for create and edit.
- **Empty states:** Ghost card. A faded, dashed placeholder in the empty column reads "Nothing here yet." and opens the new-task drawer with that column's status preselected.
- **Drag affordance (if used):** The status dropdown is the M5 mechanism. Drag-and-drop between columns is added in M12 (secret sauce), with a grab cursor and a highlighted drop column. The dropdown stays as the keyboard-accessible alternative.

## 5. Voice / microcopy

Three lines of microcopy that capture the tone of the product. Keep it short — these are the words a stressed user reads at 11pm.

| Where | Text |
|---|---|
| "+" button label | New task |
| Empty column placeholder | Nothing here yet. |
| Toast after "Copy as Prompt Context" | Context copied, ready to paste. |
| Confirm-delete message | Delete "{title}"? This can't be undone. |
| Handoff toast (M7 `task-owner`) | Handed off to {name}. |

## 6. Logo / wordmark

The tracker probably doesn't need a logo, but it does need a name and a wordmark style.

- **Product name:** `Sprint` (match PRD §11 team identity)
- **Wordmark style:** Just the name in Inter semibold, brand-primary colour, no icon.

## 7. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

- A dark mode toggle. Pick one mode and ship it.
- Multiple themes. One brand, applied consistently.
- Animations beyond a 200 ms fade on toast notifications.
- A custom icon set. Use [Lucide icons](https://lucide.dev) via Tailwind classes if you need any.

---

*DESIGN.md version: hackathon-starter v1*
