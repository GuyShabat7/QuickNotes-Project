import { CATEGORIES } from '../utils/categories'

function NoteFilters({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}) {
  const buttons = [{ value: 'all', label: 'All' }, ...CATEGORIES]

  return (
    <div className="note-filters">
      <input
        type="text"
        className="note-filters__search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search notes..."
      />
      <div className="note-filters__categories">
        {buttons.map((button) => (
          <button
            key={button.value}
            type="button"
            className={
              activeCategory === button.value
                ? 'note-filters__button note-filters__button--active'
                : 'note-filters__button'
            }
            onClick={() => onCategoryChange(button.value)}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default NoteFilters
