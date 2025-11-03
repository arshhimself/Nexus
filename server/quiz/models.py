from django.db import models
from authentication.models import User

class QuizResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="quiz_results")
    data = models.JSONField()  # store the entire quizData object as-is
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class FeedbackForm(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="feedback_forms")
    exprince_rating = models.TextField(null=True, blank=True)
    feed_back_and_improvements = models.TextField(null=True, blank=True)
    to_the_community_message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback from {self.user.name} at {self.created_at.strftime('%Y-%m-%d %H:%M')}"