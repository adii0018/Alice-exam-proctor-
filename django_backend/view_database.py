"""
Quick script to view MongoDB data
Run: python view_database.py
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'exam_proctoring.settings')
django.setup()

from api.models import (
    teachers_collection,
    students_collection,
    quizzes_collection,
    flags_collection,
    submissions_collection,
    db
)
from datetime import datetime

def print_header(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def view_database():
    print("\n🗄️  ETRIXX EXAM - MongoDB Database Viewer")
    print("="*60)
    
    # Connection Info
    print_header("📡 CONNECTION INFO")
    print(f"Database: {db.name}")
    print(f"Collections: {', '.join(db.list_collection_names())}")
    
    # Teachers
    print_header("👨‍🏫 TEACHERS")
    teachers = list(teachers_collection.find())
    print(f"Total: {len(teachers)}")
    for i, teacher in enumerate(teachers, 1):
        print(f"\n{i}. {teacher['name']}")
        print(f"   Email: {teacher['email']}")
        print(f"   Role: {teacher['role']}")
        print(f"   Active: {teacher.get('is_active', True)}")
    
    # Students
    print_header("👨‍🎓 STUDENTS")
    students = list(students_collection.find())
    print(f"Total: {len(students)}")
    for i, student in enumerate(students, 1):
        print(f"\n{i}. {student['name']}")
        print(f"   Email: {student['email']}")
        print(f"   Role: {student['role']}")
        print(f"   Active: {student.get('is_active', True)}")
    
    # Quizzes
    print_header("📝 QUIZZES")
    quizzes = list(quizzes_collection.find())
    print(f"Total: {len(quizzes)}")
    for i, quiz in enumerate(quizzes, 1):
        print(f"\n{i}. {quiz['title']}")
        print(f"   Code: {quiz['code']}")
        print(f"   Duration: {quiz['duration']} minutes")
        print(f"   Questions: {len(quiz.get('questions', []))}")
        print(f"   Active: {quiz.get('is_active', True)}")
        print(f"   Created: {quiz.get('created_at', 'N/A')}")
    
    # Submissions
    print_header("📊 SUBMISSIONS")
    submissions = list(submissions_collection.find())
    print(f"Total: {len(submissions)}")
    if submissions:
        for i, sub in enumerate(submissions[:5], 1):  # Show last 5
            print(f"\n{i}. Quiz ID: {sub['quiz_id']}")
            print(f"   Student ID: {sub['student_id']}")
            print(f"   Score: {sub['score']}/{sub['total_questions']} ({sub['percentage']:.1f}%)")
            print(f"   Time Taken: {sub['time_taken']}s")
            print(f"   Flags: {sub.get('total_flags', 0)}")
            print(f"   Status: {sub.get('status', 'submitted')}")
    else:
        print("No submissions yet")
    
    # Flags
    print_header("🚩 VIOLATIONS/FLAGS")
    flags = list(flags_collection.find())
    print(f"Total: {len(flags)}")
    if flags:
        for i, flag in enumerate(flags[:5], 1):  # Show last 5
            print(f"\n{i}. Type: {flag['flag_type']}")
            print(f"   Quiz ID: {flag['quiz_id']}")
            print(f"   Student ID: {flag['student_id']}")
            print(f"   Severity: {flag.get('severity', 'medium')}")
            print(f"   Description: {flag.get('description', 'N/A')}")
            print(f"   Resolved: {flag.get('resolved', False)}")
    else:
        print("No flags yet")
    
    # Statistics
    print_header("📈 STATISTICS")
    total_teachers = teachers_collection.count_documents({})
    total_students = students_collection.count_documents({})
    total_quizzes = quizzes_collection.count_documents({})
    active_quizzes = quizzes_collection.count_documents({'is_active': True})
    total_submissions = submissions_collection.count_documents({})
    total_flags = flags_collection.count_documents({})
    
    print(f"👨‍🏫 Teachers: {total_teachers}")
    print(f"👨‍🎓 Students: {total_students}")
    print(f"📝 Total Quizzes: {total_quizzes}")
    print(f"✅ Active Quizzes: {active_quizzes}")
    print(f"📊 Submissions: {total_submissions}")
    print(f"🚩 Flags: {total_flags}")
    
    if total_submissions > 0:
        avg_score = submissions_collection.aggregate([
            {'$group': {'_id': None, 'avg': {'$avg': '$percentage'}}}
        ])
        avg_score = list(avg_score)
        if avg_score:
            print(f"📊 Average Score: {avg_score[0]['avg']:.1f}%")
    
    print("\n" + "="*60)
    print("✅ Database view complete!")
    print("="*60 + "\n")

if __name__ == '__main__':
    try:
        view_database()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure MongoDB is running!")
