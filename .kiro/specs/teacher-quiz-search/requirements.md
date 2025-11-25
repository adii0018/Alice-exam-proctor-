# Requirements Document

## Introduction

This feature adds comprehensive search and filtering capabilities to the Teacher Dashboard, allowing teachers to efficiently find and manage quizzes based on various criteria such as quiz name, date, status, and other attributes.

## Glossary

- **Teacher Dashboard**: The web interface where teachers manage their quizzes, view submissions, and monitor student activity
- **Quiz**: An assessment created by a teacher containing questions and configuration settings
- **Search Bar**: A text input field that allows teachers to enter search queries
- **Filter**: A mechanism to narrow down quiz results based on specific criteria
- **Active Quiz**: A quiz that is currently available for students to take
- **Inactive Quiz**: A quiz that has been deactivated or has expired

## Requirements

### Requirement 1

**User Story:** As a teacher, I want to search for quizzes by name, so that I can quickly find a specific quiz without scrolling through the entire list

#### Acceptance Criteria

1. WHEN the teacher types text into the search bar, THE Teacher Dashboard SHALL filter the quiz list to show only quizzes whose names contain the search text (case-insensitive)
2. WHEN the search text is cleared, THE Teacher Dashboard SHALL display all quizzes again
3. WHEN no quizzes match the search criteria, THE Teacher Dashboard SHALL display a message indicating no results were found
4. THE Teacher Dashboard SHALL update the filtered results in real-time as the teacher types

### Requirement 2

**User Story:** As a teacher, I want to filter quizzes by date range, so that I can find quizzes created or scheduled within a specific time period

#### Acceptance Criteria

1. WHEN the teacher selects a date range filter, THE Teacher Dashboard SHALL display only quizzes created within the specified date range
2. THE Teacher Dashboard SHALL provide preset date range options (Today, Last 7 Days, Last 30 Days, Custom Range)
3. WHEN the teacher selects "Custom Range", THE Teacher Dashboard SHALL display date picker inputs for start and end dates
4. THE Teacher Dashboard SHALL validate that the end date is not before the start date

### Requirement 3

**User Story:** As a teacher, I want to filter quizzes by status (active/inactive), so that I can focus on quizzes that are currently available or need attention

#### Acceptance Criteria

1. WHEN the teacher selects a status filter, THE Teacher Dashboard SHALL display only quizzes matching the selected status
2. THE Teacher Dashboard SHALL provide filter options for "All", "Active", and "Inactive" quizzes
3. THE Teacher Dashboard SHALL display a visual indicator showing the current active filter
4. WHEN multiple filters are applied, THE Teacher Dashboard SHALL combine them using AND logic

### Requirement 4

**User Story:** As a teacher, I want to see the total count of filtered results, so that I know how many quizzes match my search criteria

#### Acceptance Criteria

1. WHEN filters or search are applied, THE Teacher Dashboard SHALL display the count of matching quizzes
2. THE Teacher Dashboard SHALL update the count in real-time as filters change
3. THE Teacher Dashboard SHALL display the count in a prominent location near the search bar
4. WHEN no filters are applied, THE Teacher Dashboard SHALL display the total number of all quizzes

### Requirement 5

**User Story:** As a teacher, I want to clear all filters with a single action, so that I can quickly reset my search and view all quizzes

#### Acceptance Criteria

1. WHEN filters or search text are active, THE Teacher Dashboard SHALL display a "Clear All" button
2. WHEN the teacher clicks the "Clear All" button, THE Teacher Dashboard SHALL remove all active filters and search text
3. WHEN the teacher clicks the "Clear All" button, THE Teacher Dashboard SHALL display all quizzes
4. WHEN no filters are active, THE Teacher Dashboard SHALL hide the "Clear All" button

### Requirement 6

**User Story:** As a teacher, I want to sort quiz results by different criteria, so that I can organize quizzes in a way that makes sense for my workflow

#### Acceptance Criteria

1. THE Teacher Dashboard SHALL provide sort options for "Name (A-Z)", "Name (Z-A)", "Newest First", and "Oldest First"
2. WHEN the teacher selects a sort option, THE Teacher Dashboard SHALL reorder the quiz list accordingly
3. THE Teacher Dashboard SHALL maintain the selected sort order when filters are applied
4. THE Teacher Dashboard SHALL display a visual indicator showing the current sort order

### Requirement 7

**User Story:** As a teacher, I want the search and filter state to persist during my session, so that I don't lose my search context when navigating between tabs

#### Acceptance Criteria

1. WHEN the teacher switches tabs and returns to the quiz list, THE Teacher Dashboard SHALL maintain the active search and filter settings
2. WHEN the teacher refreshes the quiz list, THE Teacher Dashboard SHALL reapply the active filters to the updated data
3. WHEN the teacher logs out, THE Teacher Dashboard SHALL clear all search and filter state
4. THE Teacher Dashboard SHALL preserve sort order across tab switches within the same session
