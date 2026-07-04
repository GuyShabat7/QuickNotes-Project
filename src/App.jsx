import { useState } from 'react'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'
import NoteModal from './components/NoteModal'
import './App.css'

function App() {
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)

  const handleAddNote = ({title, text}) => {
    const newNote = {
      id: crypto.randomUUID(),
      title,
      text,
      createdAt: new Date().toISOString(),
    }
    setNotes((prevNotes) => [newNote, ...prevNotes])
  }

  const handleDeleteNote = (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your note?'
    )
    if (!confirmed) {
      return
    }
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))
  }

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

  return (
    <main className="app">
      <h1 className="app__title">QuickNotes</h1>
      <div className="app__layout">
        <section className="app__form">
          <NoteForm onSubmit={handleAddNote} submitLabel="Add" />
        </section>
        <section className="app__notes">
          <NoteList
            notes={notes}
            onDeleteNote={handleDeleteNote}
            onSelectNote={setSelectedNote}
          />
        </section>
      </div>
      <NoteModal
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        onUpdateNote={handleUpdateNote}
      />
    </main>
  )
}

export default App
