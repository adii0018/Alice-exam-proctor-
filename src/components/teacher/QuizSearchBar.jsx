import { useState, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QuizSearchBar = memo(function QuizSearchBar({
  searchText,
  setSearchText,
  dateFilter,
  setDateFilter,
  customDateRange,
  setCustomDateRange,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  hasActiveFilters,
  onClearAllFilters,
}) {
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleClearSearch = useCallback(() => {
    setSearchText('')
  }, [setSearchText])

  const handleDateFilterChange = useCallback(
    (value) => {
      setDateFilter(value)
      setShowDatePicker(value === 'custom')
    },
    [setDateFilter]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-surface/50 border border-border rounded-2xl p-6 mb-6"
    >
      {/* Header with Clear All */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text mb-1">🔍 Search & Filter</h3>
          <p className="text-text-secondary text-sm">Find and organize your quizzes</p>
        </div>

        <AnimatePresence>
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClearAllFilters}
              className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/30 transition-all font-semibold"
            >
              🗑️ Clear All
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Search Input */}
      <div className="relative mb-6">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search quizzes by title, description, or code..."
            className="w-full pl-12 pr-12 py-4 bg-surface border border-border rounded-xl text-text placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg"
          />
          {searchText && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          )}
        </div>
      </div>

      {/* Enhanced Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Filter */}
        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-2">📅 Date Range</label>
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value)}
              className={`w-full px-4 py-3 bg-surface border rounded-xl text-text appearance-none cursor-pointer transition-all font-medium ${
                dateFilter !== 'all'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-2">🎯 Status</label>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full px-4 py-3 bg-surface border rounded-xl text-text appearance-none cursor-pointer transition-all font-medium ${
                statusFilter !== 'all'
                  ? 'border-secondary bg-secondary/10'
                  : 'border-border hover:border-secondary/50'
              }`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-2">🔄 Sort By</label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-border hover:border-accent/50 rounded-xl text-text appearance-none cursor-pointer transition-all font-medium"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Date Range Picker */}
      <AnimatePresence>
        {showDatePicker && dateFilter === 'custom' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden"
          >
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Start Date</label>
              <input
                type="date"
                value={
                  customDateRange?.start
                    ? new Date(customDateRange.start).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  setCustomDateRange({
                    ...customDateRange,
                    start: e.target.value ? new Date(e.target.value) : null,
                  })
                }
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">End Date</label>
              <input
                type="date"
                value={
                  customDateRange?.end
                    ? new Date(customDateRange.end).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  setCustomDateRange({
                    ...customDateRange,
                    end: e.target.value ? new Date(e.target.value) : null,
                  })
                }
                min={
                  customDateRange?.start
                    ? new Date(customDateRange.start).toISOString().split('T')[0]
                    : ''
                }
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

export default QuizSearchBar