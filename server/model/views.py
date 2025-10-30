# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# import jwt
# from django.core.mail import send_mail
# from django.template.loader import render_to_string
# from django.utils.html import strip_tags
# from django.utils.crypto import get_random_string
# import datetime
# from django.utils import timezone
# from rest_framework.exceptions import AuthenticationFailed
# from django.views.decorators.csrf import csrf_exempt
# from rest_framework.permissions import AllowAny
# # class UserView(APIView):
# #     @csrf_exempt
# #     def get(self, request):

# #         token = request.headers.get('Authorization')
# #         if not token:
# #             raise AuthenticationFailed('Unauthenticated!')

# #         try:
# #             payload = jwt.decode(token, 'secret', algorithms="HS256")
# #         except jwt.ExpiredSignatureError:
# #             raise AuthenticationFailed('Token expired!')
# #         except jwt.InvalidTokenError:
# #             raise AuthenticationFailed('Invalid token!')

# #         user = User.objects.filter(email=payload['email']).first()
# #         serializer = userSerializers(user)

# #         return Response(serializer.data)