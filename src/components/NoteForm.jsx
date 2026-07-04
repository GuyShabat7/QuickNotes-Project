import { useState, useRef, useEffect } from 'react'

function NoteForm({
  onSubmit,
  initialTitle = '',
  initialText = '',
  submitLabel = 'Add',
}) {
  const [title, setTitle] = useState(initialTitle)
  const [text, setText] = useState(initialText)
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

    onSubmit({ title: title.trim(), text: trimmedText })
    setTitle('')
    setText('')
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
      <button type="submit" className="note-form__button">
        {submitLabel}
      </button>
    </form>
  )
}

export default NoteForm
