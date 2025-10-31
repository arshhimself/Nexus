from django.urls import path
from .views import QuizResultView

urlpatterns = [
    path('quiz/submit/', QuizResultView.as_view(), name='quiz_submit'),
]
