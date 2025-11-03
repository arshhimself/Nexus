from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import jwt
from rest_framework.exceptions import AuthenticationFailed
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from .models import  QuizResult
from .serializers import QuizResultSerializer
from authentication.models import User
from utils.usercheck import authenticate_request
from .models import FeedbackForm

class QuizResultView(APIView):


    @csrf_exempt
    def get(self, request):
        token = request.headers.get('Authorization')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token expired!')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token!')

        user = User.objects.filter(email=payload['email']).first()
        serializer = QuizResultSerializer(user.quiz_results.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    @csrf_exempt
    def post(self, request):
        token = request.headers.get('Authorization')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token expired!')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token!')

        user = User.objects.filter(email=payload['email']).first()
        if not user:
            raise AuthenticationFailed('User not found!')


        quiz_data = request.data



        existing_result = QuizResult.objects.filter(user=user).first()

        if existing_result:
            # Update existing JSON
            existing_result.data = quiz_data
            existing_result.created_at = timezone.now()
            existing_result.save()
            quiz_result = existing_result

        else:
            # Create new entry
            quiz_result = QuizResult.objects.create(
                user=user,
                data=quiz_data,
                created_at=timezone.now()
            )


        serializer = QuizResultSerializer(quiz_result)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# class AllQuizResultsView(APIView):  

#     @csrf_exempt
#     def get(self, request):
#         try:
#             all_results = QuizResult.objects.all().select_related('user')
#             serializer = QuizResultSerializer(all_results, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response(
#                 {"error": str(e)}, 
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )

class AllQuizResultsView(APIView):


    @csrf_exempt
    def get(self, request):
        try:
            all_results = QuizResult.objects.all().select_related('user')
            results = []

            for result in all_results:
                # Extract avg_score from JSONField safely
                avg_score = None
                if result.data and isinstance(result.data, dict):
                    avg_score = result.data.get('avg_score')

                # Get user details directly (since it's a ForeignKey)
                username = result.user.name if hasattr(result.user, 'name') else result.user.email
                user_id = result.user.id  # if you also need the id

                results.append({
                    "user_id": user_id,
                    "user": username,
                    "avg_score": avg_score
                })

            return Response(results, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FeedBackFormView(APIView):


    @csrf_exempt
    def post(self, request):
        user = authenticate_request(request, need_user=True)
        if user.test_given == False:
            return Response(
                {"error": "You are not allowed to give the review form."},
                status=status.HTTP_400_BAD_REQUEST
            )
        feedback_data = request.data
        feedback_form = FeedbackForm.objects.create(
            user=user,  
            exprince_rating=feedback_data.get('exprince_rating', ''),
            feed_back_and_improvements=feedback_data.get('feed_back_and_improvements', ''),
            to_the_community_message=feedback_data.get('to_the_community_message', ''),
            created_at=timezone.now()
        )
        feedback_form.save()    


        # Here you can process the feedback_data as needed
        # For example, save it to the database or send an email

        return Response(
            {"message": "Feedback received successfully."},
            status=status.HTTP_200_OK
        )