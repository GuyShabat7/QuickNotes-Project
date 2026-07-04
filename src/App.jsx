import { useState, useEffect } from 'react'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'
import NoteModal from './components/NoteModal'
import NoteFilters from './components/NoteFilters'
import './App.css'

function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedNote, setSelectedNote] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const handleAddNote = ({ title, text, category }) => {
    const newNote = {
      id: crypto.randomUUID(),
      title,
      text,
      category,
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

  const handleUpdateNote = (id, { title, text, category }) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              title,
              text,
              category,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    )
    setSelectedNote(null)
  }

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.trim().toLowerCase()
    const matchesSearch =
      (note.title || '').toLowerCase().includes(query) ||
      note.text.toLowerCase().includes(query)
    const matchesCategory =
      activeCategory === 'all' || note.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="app">
      <h1 className="app__title">QuickNotes</h1>
      <div className="app__layout">
        <section className="app__form">
          <NoteForm onSubmit={handleAddNote} submitLabel="Add" />
        </section>
        <section className="app__notes">
          <NoteFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <NoteList
            notes={filteredNotes}
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
