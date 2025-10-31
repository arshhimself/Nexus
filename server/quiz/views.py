from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import jwt
from rest_framework.exceptions import AuthenticationFailed
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from .models import User, QuizResult
from .serializers import QuizResultSerializer

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

        # Get data from frontend (JSON)
        quiz_data = request.data  # full JSON from frontend (quizData)
        print("Received quiz data:", quiz_data)

        # Save it directly to the model (store JSON as-is)
        quiz_result = QuizResult.objects.create(
            user=user,
            data=quiz_data,  # assuming JSONField in model
            created_at=timezone.now()
        )

        serializer = QuizResultSerializer(quiz_result)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
