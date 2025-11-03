from django.contrib import admin
from .models import QuizResult, FeedbackForm

# Register your models here.
admin.site.register(QuizResult)
admin.site.register(FeedbackForm)