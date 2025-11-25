"""
Quiz Management Views
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from bson import ObjectId

from api.models import quizzes_collection, submissions_collection, flags_collection
from api.utils.quiz_utils import generate_quiz_code, calculate_score, validate_quiz_data, shuffle_quiz_questions
from api.utils.validators import validate_quiz_code
import logging

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def quiz_list_create(request):
    """
    GET: List all quizzes (filtered by role)
    POST: Create a new quiz (teachers only)
    """
    if request.method == 'GET':
        try:
            user = request.user
            
            # Teachers see all their quizzes
            if user['role'] == 'teacher':
                quizzes = list(quizzes_collection.find(
                    {'teacher_id': user['_id']},
                    {'questions.correct': 0}  # Hide correct answers
                ).sort('created_at', -1))
            else:
                # Students see only active quizzes
                quizzes = list(quizzes_collection.find(
                    {'is_active': True},
                    {'questions.correct': 0, 'teacher_id': 0}  # Hide correct answers and teacher info
                ).sort('created_at', -1))
            
            # Convert ObjectId to string
            for quiz in quizzes:
                quiz['_id'] = str(quiz['_id'])
                if 'teacher_id' in quiz:
                    quiz['teacher_id'] = str(quiz['teacher_id'])
            
            return Response(quizzes, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error fetching quizzes: {e}")
            return Response({
                'error': True,
                'message': 'Failed to fetch quizzes'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        try:
            user = request.user
            
            # Only teachers can create quizzes
            if user['role'] != 'teacher':
                return Response({
                    'error': True,
                    'message': 'Only teachers can create quizzes'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Validate quiz data
            is_valid, error_message = validate_quiz_data(request.data)
            if not is_valid:
                return Response({
                    'error': True,
                    'message': error_message
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Generate unique quiz code
            code = request.data.get('code')
            if code:
                code = validate_quiz_code(code)
                # Check if code already exists
                if quizzes_collection.find_one({'code': code}):
                    return Response({
                        'error': True,
                        'message': 'Quiz code already exists'
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                code = generate_quiz_code()
            
            # Prepare quiz data
            quiz_data = {
                'title': request.data['title'].strip(),
                'code': code,
                'teacher_id': user['_id'],
                'description': request.data.get('description', '').strip(),
                'duration': int(request.data['duration']),
                'questions': request.data['questions'],
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'is_active': request.data.get('is_active', True),
                'settings': {
                    'shuffle_questions': request.data.get('shuffle_questions', False),
                    'shuffle_options': request.data.get('shuffle_options', False),
                    'show_results': request.data.get('show_results', True),
                    'allow_review': request.data.get('allow_review', False)
                },
                'audio_proctoring': {
                    'enabled': request.data.get('audio_proctoring', {}).get('enabled', False),
                    'custom_keywords': request.data.get('audio_proctoring', {}).get('custom_keywords', []),
                    'suspicion_threshold': request.data.get('audio_proctoring', {}).get('suspicion_threshold', 0.5),
                    'language': request.data.get('audio_proctoring', {}).get('language', 'auto')
                }
            }
            
            # Insert quiz
            result = quizzes_collection.insert_one(quiz_data)
            quiz_data['_id'] = str(result.inserted_id)
            quiz_data['teacher_id'] = str(quiz_data['teacher_id'])
            
            logger.info(f"Quiz created: {code} by teacher {user['_id']}")
            
            return Response({
                'message': 'Quiz created successfully',
                'quiz': quiz_data
            }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            logger.error(f"Error creating quiz: {e}")
            return Response({
                'error': True,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def quiz_by_code(request, code):
    """
    Get quiz by code (for students to start quiz).
    """
    try:
        code = code.upper().strip()
        
        quiz = quizzes_collection.find_one({'code': code, 'is_active': True})
        
        if not quiz:
            return Response({
                'error': True,
                'message': 'Quiz not found or inactive'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if student already submitted
        user = request.user
        if user['role'] == 'student':
            existing_submission = submissions_collection.find_one({
                'quiz_id': str(quiz['_id']),
                'student_id': user['_id']
            })
            
            if existing_submission:
                return Response({
                    'error': True,
                    'message': 'You have already submitted this quiz',
                    'submission': {
                        'score': existing_submission.get('score'),
                        'submitted_at': existing_submission.get('submitted_at')
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Shuffle if needed
        settings = quiz.get('settings', {})
        if settings.get('shuffle_questions') or settings.get('shuffle_options'):
            quiz = shuffle_quiz_questions(
                quiz,
                settings.get('shuffle_questions', False),
                settings.get('shuffle_options', False)
            )
        
        # Remove correct answers for students
        if user['role'] == 'student':
            for question in quiz.get('questions', []):
                question.pop('correct', None)
        
        quiz['_id'] = str(quiz['_id'])
        quiz['teacher_id'] = str(quiz['teacher_id'])
        
        return Response(quiz, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error fetching quiz by code: {e}")
        return Response({
            'error': True,
            'message': 'Failed to fetch quiz'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def quiz_detail(request, quiz_id):
    """
    GET: Get quiz details
    PUT: Update quiz (teachers only)
    DELETE: Delete quiz (teachers only)
    """
    try:
        quiz = quizzes_collection.find_one({'_id': ObjectId(quiz_id)})
        
        if not quiz:
            return Response({
                'error': True,
                'message': 'Quiz not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        user = request.user
        
        if request.method == 'GET':
            # Teachers can see everything, students see limited info
            if user['role'] == 'student':
                for question in quiz.get('questions', []):
                    question.pop('correct', None)
            
            quiz['_id'] = str(quiz['_id'])
            quiz['teacher_id'] = str(quiz['teacher_id'])
            
            return Response(quiz, status=status.HTTP_200_OK)
        
        elif request.method == 'PUT':
            # Only quiz creator can update
            if user['role'] != 'teacher' or str(quiz['teacher_id']) != user['_id']:
                return Response({
                    'error': True,
                    'message': 'You do not have permission to update this quiz'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Validate update data
            update_data = {}
            
            if 'title' in request.data:
                update_data['title'] = request.data['title'].strip()
            
            if 'description' in request.data:
                update_data['description'] = request.data['description'].strip()
            
            if 'duration' in request.data:
                update_data['duration'] = int(request.data['duration'])
            
            if 'questions' in request.data:
                # Validate questions
                temp_data = {'questions': request.data['questions'], 'title': 'temp', 'description': 'temp', 'duration': 60}
                is_valid, error_message = validate_quiz_data(temp_data)
                if not is_valid:
                    return Response({
                        'error': True,
                        'message': error_message
                    }, status=status.HTTP_400_BAD_REQUEST)
                update_data['questions'] = request.data['questions']
            
            if 'is_active' in request.data:
                update_data['is_active'] = request.data['is_active']
            
            if 'settings' in request.data:
                update_data['settings'] = request.data['settings']
            
            if 'audio_proctoring' in request.data:
                audio_proctoring = request.data['audio_proctoring']
                update_data['audio_proctoring'] = {
                    'enabled': audio_proctoring.get('enabled', False),
                    'custom_keywords': audio_proctoring.get('custom_keywords', []),
                    'suspicion_threshold': audio_proctoring.get('suspicion_threshold', 0.5),
                    'language': audio_proctoring.get('language', 'auto')
                }
            
            update_data['updated_at'] = datetime.utcnow()
            
            # Update quiz
            quizzes_collection.update_one(
                {'_id': ObjectId(quiz_id)},
                {'$set': update_data}
            )
            
            logger.info(f"Quiz updated: {quiz_id} by teacher {user['_id']}")
            
            return Response({
                'message': 'Quiz updated successfully'
            }, status=status.HTTP_200_OK)
        
        elif request.method == 'DELETE':
            # Only quiz creator can delete
            if user['role'] != 'teacher' or str(quiz['teacher_id']) != user['_id']:
                return Response({
                    'error': True,
                    'message': 'You do not have permission to delete this quiz'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Delete quiz
            quizzes_collection.delete_one({'_id': ObjectId(quiz_id)})
            
            logger.info(f"Quiz deleted: {quiz_id} by teacher {user['_id']}")
            
            return Response({
                'message': 'Quiz deleted successfully'
            }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error in quiz detail: {e}")
        return Response({
            'error': True,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_quiz(request, quiz_id):
    """
    Submit quiz answers and calculate score.
    """
    try:
        user = request.user
        
        if user['role'] != 'student':
            return Response({
                'error': True,
                'message': 'Only students can submit quizzes'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get quiz
        quiz = quizzes_collection.find_one({'_id': ObjectId(quiz_id)})
        
        if not quiz:
            return Response({
                'error': True,
                'message': 'Quiz not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if already submitted
        existing_submission = submissions_collection.find_one({
            'quiz_id': quiz_id,
            'student_id': user['_id']
        })
        
        if existing_submission:
            return Response({
                'error': True,
                'message': 'Quiz already submitted'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get answers
        answers = request.data.get('answers', {})
        time_taken = request.data.get('time_taken', 0)
        
        # Calculate score
        score_details = calculate_score(quiz, answers)
        
        # Count flags for this student and quiz
        total_flags = flags_collection.count_documents({
            'student_id': user['_id'],
            'quiz_id': quiz_id
        })
        
        # Create submission
        submission_data = {
            'quiz_id': quiz_id,
            'student_id': user['_id'],
            'answers': answers,
            'submitted_at': datetime.utcnow(),
            'score': score_details['score'],
            'total_questions': score_details['total_questions'],
            'correct_answers': score_details['correct_answers'],
            'percentage': score_details['percentage'],
            'total_flags': total_flags,
            'time_taken': time_taken,
            'status': 'submitted' if total_flags == 0 else 'flagged'
        }
        
        result = submissions_collection.insert_one(submission_data)
        submission_data['_id'] = str(result.inserted_id)
        
        logger.info(f"Quiz submitted: {quiz_id} by student {user['_id']}, score: {score_details['score']}/{score_details['total_questions']}")
        
        return Response({
            'message': 'Quiz submitted successfully',
            'submission': submission_data
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        logger.error(f"Error submitting quiz: {e}")
        return Response({
            'error': True,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def submission_list(request):
    """
    Get submissions list (filtered by role).
    """
    try:
        user = request.user
        quiz_id = request.GET.get('quiz_id')
        
        query = {}
        
        if user['role'] == 'student':
            query['student_id'] = user['_id']
        elif quiz_id:
            query['quiz_id'] = quiz_id
        
        submissions = list(submissions_collection.find(query).sort('submitted_at', -1))
        
        # Add student details to each submission
        from api.models import students_collection
        
        for submission in submissions:
            submission['_id'] = str(submission['_id'])
            
            # Convert student_id to ObjectId if it's a string
            student_id = submission['student_id']
            if isinstance(student_id, str):
                try:
                    student_id = ObjectId(student_id)
                except:
                    pass
            
            # Fetch student details
            student = students_collection.find_one(
                {'_id': student_id},
                {'name': 1, 'email': 1, 'student_id': 1, '_id': 0}
            )
            
            if student:
                submission['student_name'] = student.get('name', 'Unknown')
                submission['student_email'] = student.get('email', 'N/A')
                submission['student_id_number'] = student.get('student_id', submission['student_id'])
            else:
                # Fallback: try to find by student_id field
                student = students_collection.find_one(
                    {'student_id': submission['student_id']},
                    {'name': 1, 'email': 1, 'student_id': 1, '_id': 0}
                )
                if student:
                    submission['student_name'] = student.get('name', 'Unknown')
                    submission['student_email'] = student.get('email', 'N/A')
                    submission['student_id_number'] = student.get('student_id', submission['student_id'])
                else:
                    submission['student_name'] = 'Unknown Student'
                    submission['student_email'] = 'N/A'
                    submission['student_id_number'] = submission['student_id']
        
        return Response(submissions, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error fetching submissions: {e}")
        return Response({
            'error': True,
            'message': 'Failed to fetch submissions'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def submission_detail(request, submission_id):
    """
    Get submission details.
    """
    try:
        submission = submissions_collection.find_one({'_id': ObjectId(submission_id)})
        
        if not submission:
            return Response({
                'error': True,
                'message': 'Submission not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        user = request.user
        
        # Students can only see their own submissions
        if user['role'] == 'student' and submission['student_id'] != user['_id']:
            return Response({
                'error': True,
                'message': 'You do not have permission to view this submission'
            }, status=status.HTTP_403_FORBIDDEN)
        
        submission['_id'] = str(submission['_id'])
        
        return Response(submission, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error fetching submission: {e}")
        return Response({
            'error': True,
            'message': 'Failed to fetch submission'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
