from django.urls import path
from .views import QuizResultView,AllQuizResultsView, FeedBackFormView

urlpatterns = [
    path('quiz/submit/', QuizResultView.as_view(), name='quiz_submit'),
    path('quiz/results/', AllQuizResultsView.as_view(), name='quiz_submit'),
    path('quiz/feedback/', FeedBackFormView.as_view(), name='quiz_feedback'),

]
