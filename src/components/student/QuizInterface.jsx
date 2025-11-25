// Quiz Interface - JEE/NEET Style Professional Exam Experience
import { useEffect } from "react";
import JEEExamDashboard from "./JEEExamDashboard"; // JEE/NEET style dashboard
import { playQuizStart } from "../../utils/soundUtils";

export default function QuizInterface({ quiz, onComplete, onCancel }) {
  // Play quiz start sound when component loads
  useEffect(() => {
    playQuizStart();
  }, []);

  return (
    <JEEExamDashboard
      quiz={quiz}
      onComplete={onComplete}
      onCancel={onCancel}
    />
  );
}