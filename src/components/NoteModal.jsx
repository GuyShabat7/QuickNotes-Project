import Modal from 'react-modal'
import NoteForm from './NoteForm'
import { formatDate } from '../utils/date'

Modal.setAppElement('#root')

function NoteModal({ note, onClose, onUpdateNote }) {
  return (
    <Modal
      isOpen={note !== null}
      onRequestClose={onClose}
      contentLabel="Edit note"
      className="note-modal"
      overlayClassName="note-modal__overlay"
    >
      {note && (
        <div className="note-modal__content">
          <NoteForm
            key={note.id}
            initialTitle={note.title}
            initialText={note.text}
            initialCategory={note.category}
            submitLabel="Save"
            onSubmit={(fields) => onUpdateNote(note.id, fields)}
          />
          <div className="note-modal__dates">
            <time className="note-modal__date">
              Created: {formatDate(note.createdAt)}
            </time>
            {note.updatedAt && (
              <time className="note-modal__date">
                Updated: {formatDate(note.updatedAt)}
              </time>
            )}
          </div>
          <button type="button" className="note-modal__close" onClick={onClose}>
            Close
          </button>
        </div>
      )}
    </Modal>
  )
}

export default NoteModal
