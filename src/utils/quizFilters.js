// Quiz Filter Utilities

/**
 * Get date range based on filter type
 */
export const getDateRangeFromFilter = (filter) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (filter) {
    case 'today':
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
      }
    case 'week':
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      return { start: weekAgo, end: now }
    case 'month':
      const monthAgo = new Date(today)
      monthAgo.setDate(monthAgo.getDate() - 30)
      return { start: monthAgo, end: now }
    default:
      return null
  }
}

/**
 * Check if quiz is within date range
 */
export const isWithinDateRange = (quiz, startDate, endDate) => {
  if (!quiz.created_at) return true
  
  const quizDate = new Date(quiz.created_at)
  const start = startDate ? new Date(startDate) : null
  const end = endDate ? new Date(endDate) : null
  
  if (start && quizDate < start) return false
  if (end && quizDate > end) return false
  
  return true
}

/**
 * Filter quizzes by search text (case-insensitive)
 */
export const filterBySearchText = (quizzes, searchText) => {
  if (!searchText || searchText.trim() === '') return quizzes
  
  const lowerSearch = searchText.toLowerCase().trim()
  return quizzes.filter(quiz => 
    quiz.title?.toLowerCase().includes(lowerSearch)
  )
}

/**
 * Filter quizzes by date range
 */
export const filterByDateRange = (quizzes, dateFilter, customRange) => {
  if (dateFilter === 'all') return quizzes
  
  let startDate, endDate
  
  if (dateFilter === 'custom') {
    startDate = customRange?.start
    endDate = customRange?.end
  } else {
    const range = getDateRangeFromFilter(dateFilter)
    if (range) {
      startDate = range.start
      endDate = range.end
    }
  }
  
  if (!startDate && !endDate) return quizzes
  
  return quizzes.filter(quiz => isWithinDateRange(quiz, startDate, endDate))
}

/**
 * Filter quizzes by status
 */
export const filterByStatus = (quizzes, statusFilter) => {
  if (statusFilter === 'all') return quizzes
  
  return quizzes.filter(quiz => {
    if (statusFilter === 'active') return quiz.is_active === true
    if (statusFilter === 'inactive') return quiz.is_active === false
    return true
  })
}

/**
 * Sort quizzes by specified criteria
 */
export const sortQuizzes = (quizzes, sortBy) => {
  const sorted = [...quizzes]
  
  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => 
        (a.title || '').localeCompare(b.title || '')
      )
    case 'name-desc':
      return sorted.sort((a, b) => 
        (b.title || '').localeCompare(a.title || '')
      )
    case 'date-desc': // Newest first
      return sorted.sort((a, b) => 
        new Date(b.created_at || 0) - new Date(a.created_at || 0)
      )
    case 'date-asc': // Oldest first
      return sorted.sort((a, b) => 
        new Date(a.created_at || 0) - new Date(b.created_at || 0)
      )
    default:
      return sorted
  }
}

/**
 * Main filter function - combines all filters
 */
export const filterQuizzes = (quizzes, filters) => {
  if (!quizzes || quizzes.length === 0) return []
  
  let filtered = quizzes
  
  // Apply search text filter
  filtered = filterBySearchText(filtered, filters.searchText)
  
  // Apply date range filter
  filtered = filterByDateRange(filtered, filters.dateFilter, filters.customDateRange)
  
  // Apply status filter
  filtered = filterByStatus(filtered, filters.statusFilter)
  
  // Apply sorting
  filtered = sortQuizzes(filtered, filters.sortBy)
  
  return filtered
}
