# QuickNotes — Code Explanation

A living reference explaining every file and function in the project.
Updated as new functions are added in each step.

---

## Table of Contents

- [Step 1](#step-1)
  - [1. `index.html`](#1-indexhtml--the-entry-html)
  - [2. `src/main.jsx`](#2-srcmainjsx--booting-react)
  - [3. `src/App.jsx`](#3-srcappjsx--the-main-component--the-state)
  - [4. `src/components/NoteForm.jsx`](#4-srccomponentsnoteformjsx--the-input-form)
  - [5. `src/components/NoteList.jsx`](#5-srccomponentsnotelistjsx--displaying-the-grid)
  - [6. `src/App.css`](#6-srcappcss--the-layout--the-grid)
  - [7. `src/index.css`](#7-srcindexcss--global-styles)
  - [The big picture](#the-big-picture-how-it-all-connects)
- [Step 2](#step-2)
  - [Human-readable date](#human-readable-date-formatdate--ordinal)
  - [Delete with confirmation](#delete-with-confirmation-handledeletenote)
- [Step 3](#step-3)
  - [Optional note title](#optional-note-title)
- [Step 4](#step-4)
  - [Auto-resizing textarea](#auto-resizing-textarea)
- [Step 5](#step-5)
  - [Note modal with react-modal](#note-modal-with-react-modal)
- [Step 6](#step-6)
  - [Editing a note (reusable form)](#editing-a-note-reusable-form)
- [Function Index](#function-index)

---

## Step 1

### 1. `index.html` — the entry HTML

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

- `<div id="root">` is an **empty container**. React injects the whole app inside it.
- The `<script>` loads `main.jsx`, which boots React.
- This is the *only* real HTML page — everything else is built by JavaScript/React. That's what "Single Page Application" means.

---

### 2. `src/main.jsx` — booting React

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- `createRoot(document.getElementById('root'))` — grabs the empty `<div id="root">` and tells React "this is where you live."
- `.render(<App />)` — renders the top component into it.
- `<StrictMode>` — a dev-only helper that warns about mistakes. No effect in production. It intentionally runs some code twice in dev to help catch bugs.
- `import './index.css'` — pulls in global styles.

---

### 3. `src/App.jsx` — the main component & the state

```jsx
import { useState } from 'react'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'
import './App.css'

function App() {
  const [notes, setNotes] = useState([])
```

- `App` is a **component**: a function that returns JSX (HTML-like markup). Every React UI is built from components.
- `useState([])` is a **Hook**. It gives you a piece of state React "remembers" between re-renders.
  - Returns an array of two things, destructured:
    - `notes` → the current value (starts as `[]`).
    - `setNotes` → the **only** function allowed to change it. Calling it re-renders the component with the new value.
  - **Why not a plain variable?** `let notes = []` would reset on every render and wouldn't trigger a UI update. `useState` is what makes the screen react to changes.

#### `handleAddNote(text)`

```jsx
  const handleAddNote = (text) => {
    const newNote = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
    }
    setNotes((prevNotes) => [newNote, ...prevNotes])
  }
```

Adds a note.

- Receives `text` (passed up from the form).
- Builds a **note object** with three fields:
  - `id: crypto.randomUUID()` — a unique random ID (built into the browser). React needs a stable unique `key` for list items.
  - `text` — shorthand for `text: text`.
  - `createdAt: new Date().toISOString()` — the **creation date** (assignment requirement). `new Date()` is "now"; `.toISOString()` makes a standard storable string like `2026-07-03T14:09:00.000Z`.
- `setNotes((prevNotes) => [newNote, ...prevNotes])`:
  - The **function form** `(prevNotes) => ...` is the safe way to update based on the previous value.
  - `[newNote, ...prevNotes]` builds a **brand-new array**: new note first, then old ones spread in. Newest first.
  - **Key rule:** never `notes.push(...)`. React state must be replaced with a new array/object, not mutated in place.

```jsx
  return (
    <main className="app">
      <h1 className="app__title">QuickNotes</h1>
      <div className="app__layout">
        <section className="app__form">
          <NoteForm onAddNote={handleAddNote} />
        </section>
        <section className="app__notes">
          <NoteList notes={notes} />
        </section>
      </div>
    </main>
  )
}

export default App
```

- `className` instead of `class` — `class` is a reserved word in JavaScript.
- `<NoteForm onAddNote={handleAddNote} />` — passes `handleAddNote` down as a **prop** named `onAddNote` so the child form can add to the parent's state. Data/functions flow **down** via props.
- `<NoteList notes={notes} />` — passes the current `notes` array down.
- `export default App` — makes `App` importable (used in `main.jsx`).

**Core pattern:** state lives in `App` (parent), the form tells the parent when to add, the list receives data to display. This is **"lifting state up."**

---

### 4. `src/components/NoteForm.jsx` — the input form

```jsx
import { useState } from 'react'

function NoteForm({ onAddNote }) {
  const [text, setText] = useState('')
```

- `{ onAddNote }` — the component **destructures its props**, receiving the function App passed in.
- `useState('')` — local state for the textarea's current text. A **controlled input** (React holds the value, not the DOM).

#### `handleSubmit(event)`

```jsx
  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmed = text.trim()
    if (!trimmed) {
      return
    }

    onAddNote(trimmed)
    setText('')
  }
```

- `event.preventDefault()` — stops the browser's default form behavior (a **page reload**). Essential in React forms.
- `text.trim()` — removes leading/trailing spaces.
- `if (!trimmed) return` — if empty or only spaces, **do nothing** (no blank notes).
- `onAddNote(trimmed)` — calls the parent's function, sending text up to `App`. The child "talking back" to the parent.
- `setText('')` — clears the textarea after adding.

```jsx
  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <textarea
        className="note-form__input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Write a note..."
        rows={6}
      />
      <button type="submit" className="note-form__button">
        Add
      </button>
    </form>
  )
}

export default NoteForm
```

- `onSubmit={handleSubmit}` — runs on form submit (clicking "Add" or pressing Enter).
- The **controlled textarea** — the 2-part loop:
  - `value={text}` — always shows whatever `text` state is.
  - `onChange={(event) => setText(event.target.value)}` — each keystroke reads `event.target.value` and updates state.
  - Together: type → `setText` → re-render → `value` shows new text. React is the single source of truth.
- `<textarea>` (not `<input>`) gives the **multiline** input the assignment asked for. `rows={6}` sets height.
- `type="submit"` triggers `onSubmit`.

---

### 5. `src/components/NoteList.jsx` — displaying the grid

#### `formatDate(date)`

```jsx
function formatDate(date) {
  return new Date(date).toLocaleString()
}
```

- A small **helper** (outside the component, since it doesn't need React).
- Takes the stored ISO date string, rebuilds a `Date`, and `.toLocaleString()` formats it as readable local date+time (e.g. `7/3/2026, 2:09:00 PM`).

#### `NoteList({ notes })`

```jsx
function NoteList({ notes }) {
  if (notes.length === 0) {
    return <p className="note-list__empty">No notes yet.</p>
  }
```

- Receives the `notes` array as a prop.
- **Conditional rendering:** with no notes, show a placeholder instead of an empty grid.

```jsx
  return (
    <div className="note-list">
      {notes.map((note) => (
        <article key={note.id} className="note-card">
          <p className="note-card__text">{note.text}</p>
          <time className="note-card__date">{formatDate(note.createdAt)}</time>
        </article>
      ))}
    </div>
  )
}

export default NoteList
```

- `{notes.map((note) => (...))}` — **how you render a list in React**. `.map()` turns each note into a card. `{ }` drops JavaScript into JSX.
- `key={note.id}` — **required** on lists. React tracks each item by key when the list changes. That's why we generated `id`.
- `{note.text}` and `{formatDate(note.createdAt)}` — the two required pieces: **text** and **date**.
- `<article>` / `<time>` — semantic HTML tags (could be `<div>`/`<span>`).

---

### 6. `src/App.css` — the layout & the grid

The two rules that matter most:

```css
.app__layout {
  display: grid;
  grid-template-columns: 360px 1fr;   /* left column fixed 360px, right takes the rest */
  gap: 32px;
}
```
- Requested layout: **form on the left (360px)**, **notes on the right (`1fr` = remaining space)**.

```css
.note-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
```
- The **"display notes in a grid"** requirement.
- `repeat(auto-fill, minmax(200px, 1fr))` = "fit as many columns as possible, each ≥200px, sharing space equally." Adds columns as the window widens — responsive without media queries.

```css
@media (max-width: 720px) {
  .app__layout { grid-template-columns: 1fr; }
}
```
- On narrow screens, the two columns **stack** into one.

The rest is purely visual styling.

---

### 7. `src/index.css` — global styles

Base defaults: font, background color, `margin: 0` on the body, and `box-sizing: border-box` (padding counts *inside* an element's width — avoids layout surprises).

---

### The big picture (how it all connects)

```
User types in textarea
      │  (onChange → setText)
      ▼
NoteForm holds the draft text (local state)
      │  clicks "Add" → handleSubmit → onAddNote(text)
      ▼
App.handleAddNote builds {id, text, createdAt}
      │  setNotes([...])  → state changes
      ▼
App re-renders → passes new notes to NoteList
      ▼
NoteList.map() draws a card per note (text + date) in a grid
```

Three React fundamentals power everything:
1. **State** (`useState`) — data that, when changed, updates the screen.
2. **Props** — passing data/functions between components (`App` → `NoteForm`/`NoteList`).
3. **Rendering lists** — `.map()` + `key` to turn an array into UI.

---

## Step 2

Two additions: a **human-readable date** format and a **delete button** with a confirmation prompt.

### Human-readable date (`formatDate` + `ordinal`)

The old `formatDate` used `toLocaleString()`, which gave a full numeric date like `7/3/2026, 2:09:00 PM`. Step 2 wants `Aug 31st 12:30 PM`. We rebuild the string from three pieces and add a helper for the ordinal suffix.

#### `ordinal(n)`

```jsx
function ordinal(n) {
  if (n > 3 && n < 21) return 'th'
  switch (n % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}
```

- Returns the English suffix for a day number: `1st`, `2nd`, `3rd`, `4th`…
- `if (n > 3 && n < 21) return 'th'` — handles the exceptions: **11th, 12th, 13th** (they'd wrongly become 11st/12nd/13rd otherwise).
- `n % 10` — looks at the last digit for everything else: `1 → st`, `2 → nd`, `3 → rd`, else `th`.
- Note: the brief's example `31th` is a typo; correct English is `31st`, which this produces.

#### `formatDate(date)` (rewritten)

```jsx
function formatDate(date) {
  const d = new Date(date)
  const month = d.toLocaleString('en-US', { month: 'short' })
  const day = d.getDate()
  const time = d.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  return `${month} ${day}${ordinal(day)} ${time}`
}
```

- `new Date(date)` — rebuilds a Date object from the stored ISO string.
- `toLocaleString('en-US', { month: 'short' })` — the short month name, e.g. `Aug`.
- `d.getDate()` — the day of the month as a number (1–31).
- `toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })` — 12-hour time with AM/PM, e.g. `12:30 PM`. `hour12: true` forces AM/PM; `minute: '2-digit'` keeps a leading zero (`12:05`, not `12:5`).
- The **template literal** `` `${month} ${day}${ordinal(day)} ${time}` `` glues it into `Aug 31st 12:30 PM`.

### Delete with confirmation (`handleDeleteNote`)

#### `handleDeleteNote(id)` (in `src/App.jsx`)

```jsx
  const handleDeleteNote = (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your note?'
    )
    if (!confirmed) {
      return
    }
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))
  }
```

- Receives the `id` of the note whose Delete button was clicked.
- `window.confirm(...)` — a built-in browser popup with OK/Cancel. It **returns `true`** if the user clicks OK, `false` if they cancel.
- `if (!confirmed) return` — if they cancel, stop; nothing changes.
- `setNotes((prev) => prev.filter((note) => note.id !== id))` — `.filter()` builds a **new array** keeping every note whose `id` is **not** the deleted one. That's how you remove an item from React state immutably (we don't use `.splice()`, which mutates).

#### Wiring it to the button

- `App` passes it down: `<NoteList notes={notes} onDeleteNote={handleDeleteNote} />`.
- `NoteList` now destructures `{ notes, onDeleteNote }` and renders a button per card:

```jsx
<button
  type="button"
  className="note-card__delete"
  onClick={() => onDeleteNote(note.id)}
>
  Delete
</button>
```

- `onClick={() => onDeleteNote(note.id)}` — note the **arrow function wrapper**. We write `() => onDeleteNote(note.id)` (a function to call *later*) instead of `onDeleteNote(note.id)` (which would call it immediately on every render). The wrapper also lets us pass the specific note's `id`.
- `type="button"` — so it doesn't accidentally submit a form.

Data flow for deletion:

```
Click "Delete" on a card
      │  onClick → onDeleteNote(note.id)
      ▼
App.handleDeleteNote(id) → confirm()
      │  OK → setNotes(prev.filter(...))
      ▼
App re-renders → NoteList shows the list without that note
```

---

## Step 3

Adds an **optional title** to each note. Three connected changes across the form, the state, and the display.

### Optional note title

#### `NoteForm` — a second controlled input

```jsx
function NoteForm({ onAddNote }) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
```

- A second piece of local state, `title`, alongside `text`. Each input owns its own state.

The new input in the JSX:

```jsx
<input
  type="text"
  className="note-form__title"
  value={title}
  onChange={(event) => setTitle(event.target.value)}
  placeholder="Title (optional)"
/>
```

- Same **controlled input** pattern as the textarea: `value={title}` shows the state, `onChange` updates it on each keystroke.
- `<input type="text">` (single-line) for the title vs `<textarea>` (multi-line) for the body.

#### `handleSubmit` — send both values up as an object

```jsx
  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedText = text.trim()
    if (!trimmedText) {
      return
    }

    onAddNote({ title: title.trim(), text: trimmedText })
    setTitle('')
    setText('')
  }
```

- **Only `text` is validated** (`if (!trimmedText) return`). The title has no check, so a note can be added with an empty title — that's the "title is optional" rule.
- `onAddNote({ title: title.trim(), text: trimmedText })` — we now pass an **object** with both fields instead of a lone string. Passing an object scales better than adding more and more function arguments.
- Both inputs are cleared after adding (`setTitle('')`, `setText('')`).

#### `handleAddNote` — store the title (in `src/App.jsx`)

```jsx
  const handleAddNote = ({ title, text }) => {
    const newNote = {
      id: crypto.randomUUID(),
      title,
      text,
      createdAt: new Date().toISOString(),
    }
    setNotes((prevNotes) => [newNote, ...prevNotes])
  }
```

- The parameter is now **destructured**: `({ title, text })` pulls both fields out of the object the form sent.
- `title` is added to the stored note object (shorthand for `title: title`). Everything else is unchanged from Step 1.

#### `NoteList` — show the title only if present

```jsx
<article key={note.id} className="note-card">
  {note.title && <h3 className="note-card__title">{note.title}</h3>}
  <p className="note-card__text">{note.text}</p>
  ...
```

- **Conditional rendering with `&&`:** `A && B` renders `B` only when `A` is truthy.
- An empty string `""` is **falsy**, so a note saved without a title renders no `<h3>` at all. A note with a title renders it **above the text**. This is exactly the "no title → nothing displayed" requirement.

---

## Step 4

Makes the textarea **grow and shrink to fit its content** as you type, and **removes the manual drag-resize handle**.

### Auto-resizing textarea

A `<textarea>` can't size itself to its content, but the DOM exposes how tall the content *wants* to be via `scrollHeight`. We read the real DOM element with a **ref** and adjust its height in a **`useEffect`** that runs whenever the text changes.

#### The new hooks in `NoteForm`

```jsx
import { useState, useRef, useEffect } from 'react'

function NoteForm({ onAddNote }) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [text])
```

- **`useRef(null)`** creates a stable "box" (`textareaRef`) that React fills with the actual `<textarea>` DOM node once it's rendered. You access the node as `textareaRef.current`. Changing a ref does **not** trigger a re-render — it's the escape hatch for talking to the DOM directly.
- **`ref={textareaRef}`** on the `<textarea>` (in the JSX) is what connects the box to the element.
- **`useEffect(fn, [text])`** runs `fn` *after* each render, and re-runs it whenever `text` changes (that's the `[text]` **dependency array**). So: keystroke → `setText` → re-render → effect recalculates height.
- **`if (!el) return`** — a guard in case the ref isn't attached yet (defensive).
- **The 2-step height trick:**
  - `el.style.height = 'auto'` — collapse first, so the box can *shrink* when text is deleted. Without this it could only ever grow.
  - `el.style.height = \`${el.scrollHeight}px\`` — `scrollHeight` is the full height the content needs; we set the visible height to exactly that. Result: the box always fits the text.

#### The `<textarea>` changes

```jsx
<textarea
  ref={textareaRef}
  className="note-form__input"
  value={text}
  onChange={(event) => setText(event.target.value)}
  placeholder="Write a note..."
/>
```

- Added `ref={textareaRef}`.
- **Removed** the `rows` attribute — height is now driven by the effect, and the minimum height comes from CSS instead.

#### The CSS (`.note-form__input`)

```css
.note-form__input {
  width: 100%;
  resize: none;       /* removes the drag handle in the bottom-right corner */
  overflow: hidden;   /* no scrollbar, since the box always fits its content */
  min-height: 90px;   /* starting / minimum height (replaces rows={6}) */
  padding: 12px;
  font: inherit;
  border: 1px solid #bcccdc;
  border-radius: 8px;
}
```

- `resize: none` (was `resize: vertical`) — this is what **removes the manual resize corner** the assignment asked to drop.
- `overflow: hidden` — hides the scrollbar that would otherwise flash as the height is recalculated.
- `min-height: 90px` — keeps a comfortable minimum even when empty.

**useState vs useRef (quick contrast):** use **state** for data that should re-render the UI when it changes (the note text); use a **ref** for reaching into the DOM or holding a value that shouldn't cause re-renders (the textarea element).

---

## Step 5

Clicking a note opens a **popup modal** showing its full info, built with the `react-modal` library.

### Note modal with react-modal

#### Shared date helper (`src/utils/date.js`)

`formatDate` and `ordinal` used to live inside `NoteList.jsx`. Since the modal also needs to show the date, they were **moved to a shared file** so both components can import the same function:

```jsx
export function formatDate(date) { /* ... */ }
```

- `export` makes `formatDate` importable elsewhere; `ordinal` stays private (not exported) to that file.
- Both `NoteList` and `NoteModal` now do `import { formatDate } from '../utils/date'`. This avoids duplicating the logic — one source of truth.

#### `NoteModal({ note, onClose })` (`src/components/NoteModal.jsx`)

```jsx
import Modal from 'react-modal'
import { formatDate } from '../utils/date'

Modal.setAppElement('#root')

function NoteModal({ note, onClose }) {
  return (
    <Modal
      isOpen={note !== null}
      onRequestClose={onClose}
      contentLabel="Note details"
      className="note-modal"
      overlayClassName="note-modal__overlay"
    >
      {note && (
        <div className="note-modal__content">
          {note.title && <h2 className="note-modal__title">{note.title}</h2>}
          <p className="note-modal__text">{note.text}</p>
          <time className="note-modal__date">{formatDate(note.createdAt)}</time>
          <button type="button" className="note-modal__close" onClick={onClose}>
            Close
          </button>
        </div>
      )}
    </Modal>
  )
}
```

- **`Modal.setAppElement('#root')`** — a one-time setup that tells react-modal which element wraps the app, so it can hide the background from screen readers while the modal is open (accessibility).
- **`isOpen={note !== null}`** — the modal shows itself only when a note is selected. When `note` is `null`, react-modal renders nothing visible.
- **`onRequestClose={onClose}`** — react-modal calls this when the user presses **Escape** or clicks the **backdrop**. We pass a function that clears the selected note.
- **`className` / `overlayClassName`** — react-modal's props for styling the dialog box and the dark overlay behind it (instead of its default inline styles).
- **`{note && ( ... )}`** — guards the body so we never read `note.title` when `note` is `null`.
- The body renders the note's **title (if any), text, and formatted date**, plus a Close button wired to `onClose`.

#### Selecting a note (`src/App.jsx`)

```jsx
const [selectedNote, setSelectedNote] = useState(null)
...
<NoteList
  notes={notes}
  onDeleteNote={handleDeleteNote}
  onSelectNote={setSelectedNote}
/>
<NoteModal note={selectedNote} onClose={() => setSelectedNote(null)} />
```

- `selectedNote` state holds the note being viewed (`null` = modal closed).
- `onSelectNote={setSelectedNote}` — passing the state setter down directly; the list calls it with the clicked note.
- `onClose={() => setSelectedNote(null)}` — closing just resets the selection to `null`.

#### Making the card clickable (`src/components/NoteList.jsx`)

```jsx
<article
  key={note.id}
  className="note-card"
  onClick={() => onSelectNote(note)}
>
  ...
  <button
    type="button"
    className="note-card__delete"
    onClick={(event) => {
      event.stopPropagation()
      onDeleteNote(note.id)
    }}
  >
    Delete
  </button>
</article>
```

- `onClick={() => onSelectNote(note)}` on the whole card opens the modal with that note.
- **`event.stopPropagation()`** on the Delete button is essential: the button sits *inside* the clickable card, so a click would normally **bubble up** and also trigger the card's `onClick` (opening the modal right as you delete). `stopPropagation()` stops the click from travelling up to the parent.

Data flow:

```
Click a card → onSelectNote(note) → App.setSelectedNote(note)
      ▼
selectedNote is set → <NoteModal> opens (isOpen = true)
      ▼
Press Escape / backdrop / Close → onClose → setSelectedNote(null) → modal closes
```

---

## Step 6

Lets you **edit a note** inside the modal by **reusing `NoteForm`** for both creating and updating, and records an **`updatedAt`** timestamp shown alongside the created date.

### Editing a note (reusable form)

#### `NoteForm` made generic

The form used to be hard-wired to creating notes (`onAddNote`, always empty, button always says "Add"). It now takes props so it works for **both** modes:

```jsx
function NoteForm({
  onSubmit,
  initialTitle = '',
  initialText = '',
  submitLabel = 'Add',
}) {
  const [title, setTitle] = useState(initialTitle)
  const [text, setText] = useState(initialText)
```

- `onSubmit` — the callback that receives `{ title, text }`. In create mode it's `handleAddNote`; in edit mode it updates the note. The form doesn't care which.
- `initialTitle` / `initialText` — seed the inputs. Empty for a new note; the note's current values when editing. The **`= ''` default parameters** mean the create form can omit them entirely.
- `submitLabel` — the button text (`"Add"` vs `"Save"`).
- `useState(initialTitle)` — state starts from the prop. **Important:** this only reads `initialTitle` on the **first render** (mount). That's why the modal gives the form a `key` (see below) to force a fresh mount per note.

Everything else in `handleSubmit` is unchanged except it now calls the generic `onSubmit(...)` instead of `onAddNote(...)`, and the button renders `{submitLabel}`.

#### Reusing it — create vs edit

Create (in `App.jsx`), same as before but with the new prop names:

```jsx
<NoteForm onSubmit={handleAddNote} submitLabel="Add" />
```

Edit (inside `NoteModal.jsx`), pre-filled:

```jsx
<NoteForm
  key={note.id}
  initialTitle={note.title}
  initialText={note.text}
  submitLabel="Save"
  onSubmit={(fields) => onUpdateNote(note.id, fields)}
/>
```

- `key={note.id}` — React seeds the form's state from the `initial*` props **only on mount**. Tying the `key` to the note id forces React to build a **fresh** form (with the right initial values) whenever a different note is opened. Without it, opening note B after note A could show note A's text.
- `onSubmit={(fields) => onUpdateNote(note.id, fields)}` — wraps the update call so the form only has to pass `{ title, text }`; the modal supplies which note's `id`.

#### `handleUpdateNote(id, { title, text })` (`src/App.jsx`)

```jsx
  const handleUpdateNote = (id, { title, text }) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? { ...note, title, text, updatedAt: new Date().toISOString() }
          : note
      )
    )
    setSelectedNote(null)
  }
```

- `.map(...)` builds a **new array**: every note is returned unchanged **except** the one whose `id` matches, which is replaced.
- `{ ...note, title, text, updatedAt: ... }` — the **spread** copies all existing fields (id, createdAt…), then overrides `title`, `text`, and stamps a fresh `updatedAt`. This is the immutable way to update one item (mirrors `.filter()` for delete).
- `setSelectedNote(null)` — closes the modal after saving. This also sidesteps a **stale-data** problem: `selectedNote` holds the note object from click-time, so keeping the modal open would show the pre-edit copy. Closing avoids that entirely.

#### Showing the update date

Both the card and the modal render the created date always, and the updated date **only if it exists** (`note.updatedAt && ...`), since a never-edited note has no `updatedAt`.

On the card (`NoteList.jsx`):

```jsx
<time className="note-card__date">{formatDate(note.createdAt)}</time>
{note.updatedAt && (
  <time className="note-card__date note-card__date--updated">
    Edited: {formatDate(note.updatedAt)}
  </time>
)}
```

In the modal (`NoteModal.jsx`): the same pattern, labelled `Created:` / `Updated:`.

Edit flow:

```
Open a note → modal shows NoteForm pre-filled + dates
      ▼
Edit fields → click "Save" → onUpdateNote(id, { title, text })
      ▼
App.map() replaces the note with new values + updatedAt, then closes the modal
      ▼
Card now shows the new text + an "Edited: ..." date
```

---

## Function Index

| Function | File | Purpose | Added in |
|---|---|---|---|
| `App()` | `src/App.jsx` | Root component; holds `notes` state and layout | Step 1 |
| `handleAddNote({ title, text })` | `src/App.jsx` | Builds a note object (with optional title) and prepends it to state | Step 1 (title added Step 3) |
| `NoteForm({ onSubmit, initialTitle, initialText, submitLabel })` | `src/components/NoteForm.jsx` | Reusable form for creating and editing notes | Step 1 (title Step 3, auto-resize Step 4, reusable Step 6) |
| `useEffect` resize block | `src/components/NoteForm.jsx` | Resizes the textarea to fit its content on every text change | Step 4 |
| `handleSubmit(event)` | `src/components/NoteForm.jsx` | Validates text, calls `onSubmit({ title, text })`, clears fields | Step 1 (title Step 3, generic onSubmit Step 6) |
| `NoteList({ notes, onDeleteNote, onSelectNote })` | `src/components/NoteList.jsx` | Renders clickable note cards with a Delete button | Step 1 (delete Step 2, click-to-open Step 5) |
| `NoteModal({ note, onClose, onUpdateNote })` | `src/components/NoteModal.jsx` | Popup modal to view/edit a note (embeds NoteForm) | Step 5 (editing added Step 6) |
| `handleUpdateNote(id, { title, text })` | `src/App.jsx` | Updates a note's fields + stamps `updatedAt`, closes modal | Step 6 |
| `formatDate(date)` | `src/utils/date.js` | Formats a date as `Aug 31st 12:30 PM` (shared) | Step 1 (moved to utils Step 5) |
| `ordinal(n)` | `src/utils/date.js` | Returns the day suffix (`st`/`nd`/`rd`/`th`) | Step 2 (moved to utils Step 5) |
| `handleDeleteNote(id)` | `src/App.jsx` | Confirms, then removes a note from state by id | Step 2 |
