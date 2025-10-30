# myapp/views.py
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Simple health check
def health_check(request):
    return JsonResponse({"status": "ok"})
