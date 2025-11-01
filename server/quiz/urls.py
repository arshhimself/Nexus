from django.urls import path
from .views import QuizResultView,AllQuizResultsView

urlpatterns = [
    path('quiz/submit/', QuizResultView.as_view(), name='quiz_submit'),
    path('quiz/results/', AllQuizResultsView.as_view(), name='quiz_submit'),

]
