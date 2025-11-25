# Design Document - Teacher Quiz Search & Filter

## Overview

This feature enhances the Teacher Dashboard by adding a comprehensive search and filtering system for quiz management. The implementation will be client-side focused, utilizing React state management and real-time filtering to provide instant feedback as teachers search and filter their quizzes.

## Architecture

### Component Structure

```
TeacherDashboard
├── QuizSearchBar (new component)
│   ├── SearchInput
│   ├── FilterDropdowns
│   ├── SortSelector
│   └── ClearFiltersButton
└── QuizList (enhanced)
    ├── ResultsCount
    └── FilteredQuizItems
```

### State Management

The search and filter state will be managed at the `TeacherDashboard` level and passed down to child components:

```javascript
{
  searchText: string,
  dateFilter: 'all' | 'today' | 'week' | 'month' | 'custom',
  customDateRange: { start: Date | null, end: Date | null },
  statusFilter: 'all' | 'active' | 'inactive',
  sortBy: 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc'
}
```

## Components and Interfaces

### 1. QuizSearchBar Component

**Purpose:** Provides the UI for search input, filters, and sorting options

**Props:**
```typescript
interface QuizSearchBarProps {
  searchText: string
  onSearchChange: (text: string) => void
  dateFilter: DateFilterType
  onDateFilterChange: (filter: DateFilterType) => void
  customDateRange: { start: Date | null, end: Date | null }
  onCustomDateRangeChange: (range: { start: Date | null, end: Date | null }) => void
  statusFilter: StatusFilterType
  onStatusFilterChange: (status: StatusFilterType) => void
  sortBy: SortType
  onSortChange: (sort: SortType) => void
  onClearAll: () => void
  hasActiveFilters: boolean
  resultsCount: number
  totalCount: number
}
```

**UI Layout:**
- Top row: Search input (full width on mobile, 60% on desktop)
- Second row: Date filter dropdown, Status filter dropdown, Sort dropdown
- Third row (conditional): Custom date range pickers (when custom date selected)
- Results count badge and Clear All button positioned near search bar

**Styling:**
- Glassmorphism design matching existing dashboard aesthetic
- Gradient accents for active filters
- Smooth animations for filter changes
- Responsive layout for mobile devices

### 2. Enhanced QuizList Component

**Changes:**
- Accept filtered quizzes array instead of all quizzes
- Display "No results found" message when filtered array is empty
- Show results count badge
- Maintain existing quiz card design

### 3. Filter Logic Utility

**Location:** `src/utils/quizFilters.js`

**Functions:**

```javascript
// Main filter function
filterQuizzes(quizzes, filters) => Quiz[]

// Individual filter functions
filterBySearchText(quizzes, searchText) => Quiz[]
filterByDateRange(quizzes, dateFilter, customRange) => Quiz[]
filterByStatus(quizzes, statusFilter) => Quiz[]
sortQuizzes(quizzes, sortBy) => Quiz[]

// Helper functions
isWithinDateRange(quiz, startDate, endDate) => boolean
getDateRangeFromFilter(filter) => { start: Date, end: Date }
```

## Data Models

### Filter State Type Definitions

```typescript
type DateFilterType = 'all' | 'today' | 'week' | 'month' | 'custom'

type StatusFilterType = 'all' | 'active' | 'inactive'

type SortType = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc'

interface FilterState {
  searchText: string
  dateFilter: DateFilterType
  customDateRange: {
    start: Date | null
    end: Date | null
  }
  statusFilter: StatusFilterType
  sortBy: SortType
}

interface Quiz {
  id: string
  title: string
  created_at: string
  is_active: boolean
  // ... other quiz properties
}
```

## Error Handling

### Invalid Date Range
- **Scenario:** User selects end date before start date
- **Handling:** Display inline error message, disable apply button, highlight invalid field

### Empty Results
- **Scenario:** No quizzes match filter criteria
- **Handling:** Display friendly message with suggestion to clear filters

### Search Performance
- **Scenario:** Large number of quizzes causing slow filtering
- **Handling:** Implement debouncing (300ms) for search input to reduce re-renders

## Testing Strategy

### Unit Tests
1. Filter utility functions
   - Test each filter function independently
   - Test combined filter logic
   - Test edge cases (empty arrays, null values)

2. Date range calculations
   - Test preset date ranges (today, week, month)
   - Test custom date range validation
   - Test timezone handling

### Component Tests
1. QuizSearchBar
   - Test search input updates state
   - Test filter dropdown interactions
   - Test clear all functionality
   - Test results count display

2. Enhanced QuizList
   - Test rendering with filtered results
   - Test empty state display
   - Test results count accuracy

### Integration Tests
1. Full filter workflow
   - Apply multiple filters simultaneously
   - Clear filters and verify reset
   - Switch between tabs and verify state persistence

2. Performance tests
   - Test with large quiz datasets (100+ quizzes)
   - Verify debouncing works correctly
   - Check for memory leaks on repeated filtering

## Implementation Notes

### Performance Optimization
- Use `useMemo` to memoize filtered results
- Implement debouncing for search input
- Avoid unnecessary re-renders with `React.memo` for quiz cards

### Accessibility
- Ensure all filter controls are keyboard navigable
- Add ARIA labels for screen readers
- Provide clear focus indicators
- Announce results count changes to screen readers

### Mobile Responsiveness
- Stack filters vertically on small screens
- Use bottom sheet for filter options on mobile
- Ensure touch targets are at least 44x44px
- Optimize for one-handed use

### Session Persistence
- Store filter state in component state (not localStorage)
- Clear state on logout
- Maintain state when switching tabs within dashboard
- Reset to defaults on page refresh

## UI/UX Considerations

### Visual Feedback
- Show loading state while applying filters
- Animate filter badge counts
- Highlight active filters with gradient
- Smooth transitions for result updates

### User Guidance
- Tooltip hints for filter options
- Placeholder text in search bar: "Search quizzes by name..."
- Empty state with helpful message and clear filters CTA
- Results count format: "Showing X of Y quizzes"

### Filter Combinations
- All filters work together with AND logic
- Clear indication when multiple filters are active
- Easy way to remove individual filters
- One-click clear all option
