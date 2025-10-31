from django.db import models
from authentication.models import User

class QuizResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="quiz_results")
    data = models.JSONField()  # store the entire quizData object as-is
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
