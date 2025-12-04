from django.db import models
from django.conf import settings
from django.utils import timezone

User = settings.AUTH_USER_MODEL

class Idea(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    votes_count = models.IntegerField(default=0)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ideas")  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    

class Comment(models.Model):
    idea = models.ForeignKey(Idea, related_name="comments", on_delete=models.CASCADE)
    text = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author_id} on {self.idea_id}"


class Vote(models.Model):
    idea = models.ForeignKey(Idea, related_name="votes", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name="votes", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("idea", "user")

    def __str__(self):
        return f"Vote: {self.user_id} -> {self.idea_id}"

