// Quiz List - yahan teacher apne saare quizzes dekh sakta hai
import { motion } from "framer-motion"; // Smooth animations
import { useState } from "react";
import toast from "react-hot-toast"; // Notifications
import apiService from "../../services/api"; // Backend API calls

export default function QuizList({ quizzes, onRefresh }) {
  // Quiz list ke states
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Selected quiz for details modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // Delete confirmation state

  // Quiz delete karne wala function
  const handleDelete = async (quizId) => {
    try {
      await apiService.deleteQuiz(quizId); // Backend se quiz delete karte hain
      toast.success("Quiz delete ho gaya bhai!"); // Success message
      onRefresh(); // List refresh kar dete hain
      setShowDeleteConfirm(null); // Confirmation dialog band kar dete hain
    } catch (error) {
      toast.error("Quiz delete nahi hua!"); // Error message
    }
  };

  const handleToggleActive = async (quiz) => {
    try {
      await apiService.updateQuiz(quiz._id, { is_active: !quiz.is_active });
      toast.success(`Quiz ${quiz.is_active ? "deactivated" : "activated"}`);
      onRefresh();
    } catch (error) {
      toast.error("Failed to update quiz");
    }
  };

  // Quiz code copy karne wala function
  const copyQuizCode = (code) => {
    navigator.clipboard.writeText(code); // Clipboard mein copy kar dete hain
    toast.success("Quiz code copy ho gaya! 📋"); // Success message
  };

  if (quizzes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-surface/50 border border-border rounded-2xl p-12 text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="text-6xl mb-4"
        >
          🔍
        </motion.div>
        <h3 className="text-2xl font-bold text-text mb-2">No Quizzes Found</h3>
        <p className="text-text-secondary mb-4">
          No quizzes match your search criteria
        </p>
        <p className="text-sm text-text-secondary/70">
          Try adjusting your filters or search terms
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {quizzes.map((quiz, index) => (
        <motion.div
          key={quiz._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="quiz-list-item teacher-dashboard"
          style={{
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Title and Status */}
              <div className="flex items-center gap-3 mb-3">
                <h3 className="quiz-title">
                  {quiz.title}
                </h3>
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                    quiz.is_active
                      ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                      : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                  }`}
                >
                  {quiz.is_active ? "✓ Active" : "○ Inactive"}
                </motion.span>
              </div>

              {/* Description */}
              <p className="quiz-description">{quiz.description}</p>

              {/* Quiz Info */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-lg border border-blue-200">
                  <span className="text-blue-600">🔑</span>
                  <span className="font-mono font-bold text-blue-800">{quiz.code}</span>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyQuizCode(quiz.code)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    📋
                  </motion.button>
                </div>

                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-violet-50 px-3 py-2 rounded-lg border border-purple-200">
                  <span className="text-purple-600">❓</span>
                  <span className="font-semibold text-purple-800">{quiz.questions.length} Questions</span>
                </div>

                <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 rounded-lg border border-green-200">
                  <span className="text-green-600">⏱️</span>
                  <span className="font-semibold text-green-800">{quiz.duration} Minutes</span>
                </div>

                <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-2 rounded-lg border border-orange-200">
                  <span className="text-orange-600">📅</span>
                  <span className="font-semibold text-orange-800">{new Date(quiz.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 ml-6">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleToggleActive(quiz)}
                className={`px-4 py-2.5 rounded-xl font-bold shadow-lg transition-all ${
                  quiz.is_active
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-xl"
                    : "bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:shadow-xl"
                }`}
              >
                {quiz.is_active ? "⏸️ Deactivate" : "▶️ Activate"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedQuiz(quiz)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all font-bold shadow-lg"
              >
                👁️ View Details
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteConfirm(quiz._id)}
                className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all font-bold shadow-lg"
              >
                🗑️ Delete
              </motion.button>
            </div>
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm === quiz._id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 pt-4 border-t border-border"
            >
              <p className="text-yellow-500 mb-3">
                ⚠️ Are you sure you want to delete this quiz?
              </p>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(quiz._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-theme"
                >
                  Yes, Delete
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-surface border border-border text-text rounded-lg hover:bg-surface/80 transition-theme"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}

      {/* Quiz Details Modal */}
      {selectedQuiz && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedQuiz(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="backdrop-blur-xl bg-surface border border-border rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text">
                {selectedQuiz.title}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedQuiz(null)}
                className="text-text-secondary hover:text-text text-2xl transition-theme"
              >
                ×
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text mb-2">
                  Questions:
                </h3>
                {selectedQuiz.questions.map((q, i) => (
                  <div key={i} className="bg-surface border border-border rounded-lg p-4 mb-3">
                    <p className="text-text font-medium mb-2">
                      {i + 1}. {q.question}
                    </p>
                    <div className="space-y-1">
                      {q.options.map((opt, j) => (
                        <p
                          key={j}
                          className={`text-sm ${
                            j === q.correct
                              ? "text-accent font-semibold"
                              : "text-text-secondary"
                          }`}
                        >
                          {String.fromCharCode(65 + j)}. {opt}
                          {j === q.correct && " ✓"}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
