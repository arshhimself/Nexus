from django.urls import path
from .views import (
    IdeaListCreateView,
    IdeaRetrieveUpdateDeleteView,
    CommentListCreateView,
    ToggleVoteView,UserVotesView
)

urlpatterns = [
    path("ideas/", IdeaListCreateView.as_view()),
    path("ideas/<int:idea_id>/", IdeaRetrieveUpdateDeleteView.as_view()),

    path("ideas/<int:idea_id>/comments/", CommentListCreateView.as_view()),

    path("ideas/<int:idea_id>/vote/", ToggleVoteView.as_view()),
    path("user/votes/", UserVotesView.as_view(), name="user-votes"),
]
