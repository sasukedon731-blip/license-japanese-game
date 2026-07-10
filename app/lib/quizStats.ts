export const saveResult = (wrongIds: string[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('wrongIds', JSON.stringify(wrongIds))
}

export const getWrongIds = (): string[] => {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem('wrongIds')
  return raw ? JSON.parse(raw) : []
}

export const getReviewCount = (): number => {
  return getWrongIds().length
}
