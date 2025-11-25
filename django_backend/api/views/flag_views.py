"""
Flag Management Views
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from bson import ObjectId

from api.models import flags_collection
from api.utils.flag_utils import should_aggregate_flag, increase_flag_severity, get_severity_for_type, get_flag_statistics
import logging

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def flag_list_create(request):
    """
    GET: List flags (filtered by role and query params)
    POST: Create a new flag (students only, auto-created during quiz)
    """
    if request.method == 'GET':
        try:
            user = request.user
            quiz_id = request.GET.get('quiz_id')
            student_id = request.GET.get('student_id')
            resolved = request.GET.get('resolved')
            severity = request.GET.get('severity')
            
            query = {}
            
            # Role-based filtering
            if user['role'] == 'student':
                query['student_id'] = user['_id']
            else:
                # Teachers can filter by quiz or student
                if quiz_id:
                    query['quiz_id'] = quiz_id
                if student_id:
                    query['student_id'] = student_id
            
            # Additional filters
            if resolved is not None:
                query['resolved'] = resolved.lower() == 'true'
            
            if severity:
                query['severity'] = severity.lower()
            
            # Get flags
            flags = list(flags_collection.find(query).sort('timestamp', -1).limit(100))
            
            # Convert ObjectId to string
            for flag in flags:
                flag['_id'] = str(flag['_id'])
                if 'resolved_by' in flag and flag['resolved_by']:
                    flag['resolved_by'] = str(flag['resolved_by'])
            
            # Get statistics if requested
            include_stats = request.GET.get('include_stats', 'false').lower() == 'true'
            response_data = {'flags': flags}
            
            if include_stats:
                stats = get_flag_statistics(quiz_id=quiz_id, student_id=student_id)
                response_data['statistics'] = stats
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error fetching flags: {e}")
            return Response({
                'error': True,
                'message': 'Failed to fetch flags'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        try:
            user = request.user
            
            # Get flag data
            quiz_id = request.data.get('quiz_id')
            flag_type = request.data.get('type')
            description = request.data.get('description', '')
            
            if not quiz_id or not flag_type:
                return Response({
                    'error': True,
                    'message': 'quiz_id and type are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if should aggregate with existing flag
            existing_flag = should_aggregate_flag(user['_id'], quiz_id, flag_type)
            
            if existing_flag:
                # Increase severity of existing flag
                new_severity = increase_flag_severity(existing_flag['_id'])
                
                logger.info(f"Flag aggregated: {existing_flag['_id']}, new severity: {new_severity}")
                
                return Response({
                    'message': 'Flag aggregated with existing flag',
                    'flag_id': str(existing_flag['_id']),
                    'severity': new_severity,
                    'aggregated': True
                }, status=status.HTTP_200_OK)
            
            # Create new flag
            severity = request.data.get('severity') or get_severity_for_type(flag_type)
            
            flag_data = {
                'student_id': user['_id'],
                'quiz_id': quiz_id,
                'type': flag_type,
                'description': description,
                'timestamp': datetime.utcnow(),
                'severity': severity,
                'resolved': False,
                'count': 1
            }
            
            result = flags_collection.insert_one(flag_data)
            flag_data['_id'] = str(result.inserted_id)
            
            logger.info(f"Flag created: {flag_type} for student {user['_id']} in quiz {quiz_id}")
            
            # TODO: Broadcast flag via WebSocket to monitoring teachers
            
            return Response({
                'message': 'Flag created successfully',
                'flag': flag_data
            }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            logger.error(f"Error creating flag: {e}")
            return Response({
                'error': True,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def flag_detail(request, flag_id):
    """
    GET: Get flag details
    PUT: Update flag (resolve/unresolve - teachers only)
    DELETE: Delete flag (teachers only)
    """
    try:
        flag = flags_collection.find_one({'_id': ObjectId(flag_id)})
        
        if not flag:
            return Response({
                'error': True,
                'message': 'Flag not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        user = request.user
        
        if request.method == 'GET':
            # Students can only see their own flags
            if user['role'] == 'student' and flag['student_id'] != user['_id']:
                return Response({
                    'error': True,
                    'message': 'You do not have permission to view this flag'
                }, status=status.HTTP_403_FORBIDDEN)
            
            flag['_id'] = str(flag['_id'])
            if 'resolved_by' in flag and flag['resolved_by']:
                flag['resolved_by'] = str(flag['resolved_by'])
            
            return Response(flag, status=status.HTTP_200_OK)
        
        elif request.method == 'PUT':
            # Only teachers can update flags
            if user['role'] != 'teacher':
                return Response({
                    'error': True,
                    'message': 'Only teachers can update flags'
                }, status=status.HTTP_403_FORBIDDEN)
            
            update_data = {}
            
            # Resolve/unresolve flag
            if 'resolved' in request.data:
                resolved = request.data['resolved']
                update_data['resolved'] = resolved
                
                if resolved:
                    update_data['resolved_by'] = user['_id']
                    update_data['resolved_at'] = datetime.utcnow()
                    
                    if 'resolution_note' in request.data:
                        update_data['resolution_note'] = request.data['resolution_note']
                else:
                    update_data['resolved_by'] = None
                    update_data['resolved_at'] = None
                    update_data['resolution_note'] = None
            
            # Update severity
            if 'severity' in request.data:
                severity = request.data['severity'].lower()
                if severity in ['low', 'medium', 'high', 'critical']:
                    update_data['severity'] = severity
            
            update_data['updated_at'] = datetime.utcnow()
            
            # Update flag
            flags_collection.update_one(
                {'_id': ObjectId(flag_id)},
                {'$set': update_data}
            )
            
            logger.info(f"Flag updated: {flag_id} by teacher {user['_id']}")
            
            return Response({
                'message': 'Flag updated successfully'
            }, status=status.HTTP_200_OK)
        
        elif request.method == 'DELETE':
            # Only teachers can delete flags
            if user['role'] != 'teacher':
                return Response({
                    'error': True,
                    'message': 'Only teachers can delete flags'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Delete flag
            flags_collection.delete_one({'_id': ObjectId(flag_id)})
            
            logger.info(f"Flag deleted: {flag_id} by teacher {user['_id']}")
            
            return Response({
                'message': 'Flag deleted successfully'
            }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error in flag detail: {e}")
        return Response({
            'error': True,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
