from rest_framework import serializers
from .models import QuizResult

class QuizResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizResult
        fields = ['id', 'user', 'data', 'created_at']
        read_only_fields = ['user', 'created_at']
