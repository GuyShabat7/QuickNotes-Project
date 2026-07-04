import { formatDate } from '../utils/date'

function NoteList({ notes, onDeleteNote, onSelectNote }) {
  if (notes.length === 0) {
    return <p className="note-list__empty">No notes yet.</p>
  }

  return (
    <div className="note-list">
      {notes.map((note) => (
        <article
          key={note.id}
          className="note-card"
          onClick={() => onSelectNote(note)}
        >
          {note.title && <h3 className="note-card__title">{note.title}</h3>}
          <p className="note-card__text">{note.text}</p>
          <time className="note-card__date">{formatDate(note.createdAt)}</time>
          {note.updatedAt && (
            <time className="note-card__date note-card__date--updated">
              Edited: {formatDate(note.updatedAt)}
            </time>
          )}
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
      ))}
    </div>
  )
}

export default NoteList
