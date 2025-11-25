# Implementation Plan - Teacher Quiz Search & Filter

- [x] 1. Create filter utility functions


  - Create `src/utils/quizFilters.js` file with core filtering logic
  - Implement `filterBySearchText()` function for case-insensitive name search
  - Implement `filterByDateRange()` function with preset and custom date range support
  - Implement `filterByStatus()` function for active/inactive filtering
  - Implement `sortQuizzes()` function with multiple sort options
  - Implement main `filterQuizzes()` function that combines all filters
  - Add helper functions for date calculations (today, last 7 days, last 30 days)
  - _Requirements: 1.1, 2.1, 2.2, 3.1, 6.1, 6.2_





- [x] 2. Create QuizSearchBar component

  - [x] 2.1 Create component file and basic structure

    - Create `src/components/teacher/QuizSearchBar.jsx`
    - Set up component props interface

    - Implement glassmorphism container styling matching dashboard theme
    - Add responsive layout structure (mobile-first approach)
    - _Requirements: 1.1, 4.3_


  - [ ] 2.2 Implement search input field
    - Add search input with icon
    - Implement debounced onChange handler (300ms delay)

    - Add placeholder text "Search quizzes by name..."
    - Style with gradient focus effect
    - Add clear button (X icon) when text is present
    - _Requirements: 1.1, 1.2, 1.4_


  - [ ] 2.3 Implement date filter dropdown
    - Create dropdown with options: All, Today, Last 7 Days, Last 30 Days, Custom Range

    - Add custom date range picker (show/hide based on selection)
    - Implement date validation (end date >= start date)
    - Style with gradient for active filter
    - Add calendar icon
    - _Requirements: 2.1, 2.2, 2.3, 2.4_



  - [ ] 2.4 Implement status filter dropdown
    - Create dropdown with options: All, Active, Inactive
    - Add visual indicator for active filter
    - Style with gradient accent when filter is active
    - Add status icon


    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 2.5 Implement sort selector dropdown
    - Create dropdown with sort options: Name (A-Z), Name (Z-A), Newest First, Oldest First
    - Add visual indicator showing current sort order




    - Add sort icon with direction indicator
    - _Requirements: 6.1, 6.2, 6.4_

  - [x] 2.6 Add results count and clear all button

    - Display results count badge: "Showing X of Y quizzes"
    - Implement "Clear All" button (show only when filters are active)

    - Add smooth fade-in/out animation for Clear All button

    - Style Clear All button with red accent
    - _Requirements: 4.1, 4.2, 4.4, 5.1, 5.2, 5.3, 5.4_


- [ ] 3. Integrate search functionality into TeacherDashboard
  - [x] 3.1 Add filter state management

    - Add filter state to TeacherDashboard component
    - Create state for: searchText, dateFilter, customDateRange, statusFilter, sortBy
    - Implement state update handlers for each filter type
    - _Requirements: 7.1, 7.2_


  - [x] 3.2 Implement filtering logic

    - Import filter utilities
    - Use useMemo to memoize filtered quiz results
    - Apply filters whenever state or quizzes change

    - Calculate hasActiveFilters flag
    - _Requirements: 1.1, 3.4, 4.2_


  - [ ] 3.3 Add QuizSearchBar to dashboard
    - Import and render QuizSearchBar component above QuizList
    - Pass all filter state and handlers as props

    - Position within the quizzes tab content area
    - Ensure proper spacing and layout


    - _Requirements: 1.1, 4.3_

  - [ ] 3.4 Update QuizList to use filtered results
    - Pass filtered quizzes to QuizList instead of all quizzes
    - Update QuizList to show empty state when no results
    - Add "No quizzes found" message with clear filters suggestion



    - Maintain existing quiz card styling
    - _Requirements: 1.3, 4.1_

- [ ] 4. Add session persistence
  - Maintain filter state when switching between dashboard tabs
  - Reapply filters when quiz data is refreshed
  - Clear filter state on logout



  - Preserve sort order across tab switches
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 5. Add animations and polish
  - Add smooth transitions for filter changes
  - Implement fade-in animation for filtered results


  - Add loading state during filter application
  - Animate results count updates


  - Add hover effects for filter controls
  - Ensure all animations match existing dashboard style
  - _Requirements: 1.4, 3.3_




- [ ] 6. Optimize performance
  - Implement debouncing for search input (300ms)
  - Use React.memo for QuizSearchBar component
  - Memoize filter utility functions where appropriate
  - Test with large datasets (100+ quizzes)
  - Profile and optimize re-renders
  - _Requirements: 1.4_

- [ ] 7. Add accessibility features
  - Add ARIA labels to all filter controls
  - Ensure keyboard navigation works for all inputs
  - Add focus indicators for all interactive elements
  - Announce results count changes to screen readers
  - Test with screen reader
  - Ensure minimum touch target size (44x44px) on mobile
  - _Requirements: 4.3_

- [ ] 8. Implement mobile responsive design
  - Stack filters vertically on small screens
  - Optimize search bar for mobile viewport
  - Ensure dropdowns work well on touch devices
  - Test on various screen sizes (320px to 1920px)
  - Optimize for one-handed mobile use
  - _Requirements: 1.1, 2.1, 3.1, 6.1_
