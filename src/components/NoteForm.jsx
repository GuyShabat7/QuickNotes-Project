import { useState, useRef, useEffect } from 'react'
import { CATEGORIES } from '../utils/categories'

function NoteForm({
  onSubmit,
  initialTitle = '',
  initialText = '',
  initialCategory = CATEGORIES[0].value,
  submitLabel = 'Add',
}) {
  const [title, setTitle] = useState(initialTitle)
  const [text, setText] = useState(initialText)
  const [category, setCategory] = useState(initialCategory)
  const textareaRef = useRef(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [text])

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedText = text.trim()
    if (!trimmedText) {
      return
    }

    onSubmit({ title: title.trim(), text: trimmedText, category })
    setTitle('')
    setText('')
    setCategory(initialCategory)
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="note-form__title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Title (optional)"
      />
      <textarea
        ref={textareaRef}
        className="note-form__input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Write a note..."
      />
      <select
        className="note-form__category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <button type="submit" className="note-form__button">
        {submitLabel}
      </button>
    </form>
  )
}

export default NoteForm
