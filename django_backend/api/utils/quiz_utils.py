"""
Quiz utility functions
"""
import random
import string
from api.models import quizzes_collection
import logging

logger = logging.getLogger(__name__)


def generate_quiz_code(length=8):
    """
    Generate a unique quiz code.
    
    Args:
        length (int): Length of the code (default: 8)
        
    Returns:
        str: Unique quiz code
    """
    max_attempts = 10
    
    for _ in range(max_attempts):
        # Generate random alphanumeric code
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
        
        # Check if code already exists
        if not quizzes_collection.find_one({'code': code}):
            return code
    
    # If all attempts failed, add timestamp
    import time
    timestamp = str(int(time.time()))[-4:]
    code = ''.join(random.choices(string.ascii_uppercase, k=length-4)) + timestamp
    
    return code


def calculate_score(quiz, answers):
    """
    Calculate quiz score based on answers.
    
    Args:
        quiz (dict): Quiz document with questions
        answers (dict): Student answers {question_index: selected_option}
        
    Returns:
        dict: Score details {score, total_questions, correct_answers, percentage}
    """
    questions = quiz.get('questions', [])
    total_questions = len(questions)
    correct_answers = 0
    
    for i, question in enumerate(questions):
        student_answer = answers.get(str(i))
        correct_answer = question.get('correct')
        
        if student_answer is not None and student_answer == correct_answer:
            correct_answers += 1
    
    score = correct_answers
    percentage = (correct_answers / total_questions * 100) if total_questions > 0 else 0
    
    return {
        'score': score,
        'total_questions': total_questions,
        'correct_answers': correct_answers,
        'percentage': round(percentage, 2)
    }


def validate_quiz_data(data):
    """
    Validate quiz data structure.
    
    Args:
        data (dict): Quiz data
        
    Returns:
        tuple: (is_valid, error_message)
    """
    # Check required fields
    required_fields = ['title', 'description', 'duration', 'questions']
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
    
    # Validate title
    if not data['title'] or len(data['title'].strip()) < 3:
        return False, "Title must be at least 3 characters long"
    
    # Validate duration
    try:
        duration = int(data['duration'])
        if duration < 1 or duration > 300:
            return False, "Duration must be between 1 and 300 minutes"
    except (ValueError, TypeError):
        return False, "Duration must be a valid number"
    
    # Validate questions
    questions = data.get('questions', [])
    if not questions or len(questions) == 0:
        return False, "Quiz must have at least one question"
    
    if len(questions) > 100:
        return False, "Quiz cannot have more than 100 questions"
    
    for i, question in enumerate(questions):
        # Check question text
        if not question.get('question') or len(question['question'].strip()) < 5:
            return False, f"Question {i+1}: Question text must be at least 5 characters long"
        
        # Check options
        options = question.get('options', [])
        if not options or len(options) != 4:
            return False, f"Question {i+1}: Must have exactly 4 options"
        
        for j, option in enumerate(options):
            if not option or len(option.strip()) == 0:
                return False, f"Question {i+1}, Option {j+1}: Cannot be empty"
        
        # Check correct answer
        correct = question.get('correct')
        if correct is None or not isinstance(correct, int):
            return False, f"Question {i+1}: Must specify correct answer index"
        
        if correct < 0 or correct >= len(options):
            return False, f"Question {i+1}: Correct answer index out of range"
    
    return True, None


def shuffle_quiz_questions(quiz, shuffle_questions=False, shuffle_options=False):
    """
    Shuffle quiz questions and/or options.
    
    Args:
        quiz (dict): Quiz document
        shuffle_questions (bool): Whether to shuffle questions
        shuffle_options (bool): Whether to shuffle options
        
    Returns:
        dict: Shuffled quiz
    """
    quiz_copy = quiz.copy()
    questions = quiz_copy.get('questions', []).copy()
    
    if shuffle_questions:
        random.shuffle(questions)
    
    if shuffle_options:
        for question in questions:
            options = question['options'].copy()
            correct_answer = options[question['correct']]
            
            random.shuffle(options)
            
            # Update correct answer index
            question['correct'] = options.index(correct_answer)
            question['options'] = options
    
    quiz_copy['questions'] = questions
    return quiz_copy
