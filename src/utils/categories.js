export const CATEGORIES = [
  { value: 'personal', label: 'Personal', color: '#e0f2fe' },
  { value: 'work', label: 'Work', color: '#ede9fe' },
  { value: 'ideas', label: 'Ideas', color: '#dcfce7' },
  { value: 'urgent', label: 'Urgent', color: '#fee2e2' },
]

export function getCategoryColor(value) {
  const category = CATEGORIES.find((c) => c.value === value)
  return category ? category.color : '#ffffff'
}
